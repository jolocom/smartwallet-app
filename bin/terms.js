const fetch = require('node-fetch')
const fs = require('fs')
const shell = require('shelljs')

const CURRENT_PATH = process.cwd()
const EXPORT_URL = 'https://api.poeditor.com/v2/projects/export'
const SECRETS_REPO = 'dev@hetz1.jolocom.io:poeditor-key'
const API_KEY_LOCATION = `${CURRENT_PATH}/bin/poeditor-key/POEDITOR_TOKEN.txt`
const PROJECT_ID_LOCATION = `${CURRENT_PATH}/bin/poeditor-key/POEDITOR_SW2_PROJECT_ID.txt`

const cloneSecrets = () => {
  return new Promise((res, rej) => {
    shell.cd(`${CURRENT_PATH}/bin`)
    shell.rm('-rf', `poeditor-key`)
    shell.exec(
      `git clone ${SECRETS_REPO} -b master`,
      {},
      (code, stdout, stderr) => {
        if (code != 0) return rej(new Error(stderr))
        return res(stdout)
      },
    )
  })
}

const readTextFile = (location) => {
  return new Promise((res, rej) => {
    fs.readFile(location, 'utf8', (err, data) => {
      if (err) rej(err)
      else res(data.toString())
    })
  })
}

const getPoeditorData = async () => {
  const apiKey = (await readTextFile(API_KEY_LOCATION)).trim()
  const projectId = (await readTextFile(PROJECT_ID_LOCATION)).trim()

  return { apiKey, projectId }
}

const getExportUrl = (apiKey, projectId, language) => {
  const params = new URLSearchParams({
    api_token: apiKey,
    id: projectId,
    language,
    type: 'key_value_json',
  })

  return fetch(EXPORT_URL, {
    method: 'POST',
    body: params.toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
    .then((res) => res.json())
    .then((json) => json.result.url)
}

const downloadTerms = (url) => fetch(url).then((res) => res.json())

const saveTerms = (name, terms) => {
  fs.writeFile(
    `${CURRENT_PATH}/src/translations/${name}`,
    JSON.stringify(terms, null, 4),
    (err) => {
      if (err) {
        throw new Error(err)
      }
    },
  )
}

const getTerms = (language) =>
  getPoeditorData()
    .then(({ apiKey, projectId }) => getExportUrl(apiKey, projectId, language))
    .then(downloadTerms)
    .then((terms) => saveTerms(`${language}.json`, terms))
    .then(() =>
      console.log(`Successfully saved ${language.toUpperCase()} terms`),
    )
    .catch((e) => {
      console.warn(`Failed getting terms for ${language.toUpperCase()}`, e)
    })

const main = async () => {
  await cloneSecrets().then(console.log)
  getTerms('en')
  getTerms('de')
}

main()
