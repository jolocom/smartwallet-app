import fetch from 'node-fetch'
import fs from 'fs'
import shell from 'shelljs'

const CURRENT_PATH = process.cwd()
const EXPORT_URL = 'https://api.poeditor.com/v2/projects/export'
const SECRETS_REPO = 'dev@hetz1.jolocom.io:poeditor-key'
const API_KEY_LOCATION = `${CURRENT_PATH}/bin/poeditor-key/POEDITOR_TOKEN.txt`
const PROJECT_ID_LOCATION = `${CURRENT_PATH}/bin/poeditor-key/POEDITOR_SW2_PROJECT_ID.txt`
const TRANSLATIONS_LOCATION = `${CURRENT_PATH}/src/translations/`

enum Languages {
  en = 'en',
  de = 'de',
}

const cloneSecrets = () => {
  return new Promise((res, rej) => {
    shell.cd(`${CURRENT_PATH}/bin`)
    shell.rm('-rf', `poeditor-key`)
    shell.exec(
      `git clone ${SECRETS_REPO} -b master`,
      {
        silent: true,
      },
      // NOTE: stderr and stdout are switched in the types for some reason
      (code, stderr, stdout) => {
        if (code != 0) return rej(new Error(stderr))
        return res(stdout)
      },
    )
  })
}

const readTextFile = (location: string) => {
  return new Promise<string>((res, rej) => {
    fs.readFile(location, 'utf8', (err, data) => {
      if (err) rej(err)
      else res(data.toString().trim())
    })
  })
}

const getPoeditorSecrets = async () => {
  const apiKey = await readTextFile(API_KEY_LOCATION)
  const projectId = await readTextFile(PROJECT_ID_LOCATION)

  return { apiKey, projectId }
}

const getExportUrl = async (
  apiKey: string,
  projectId: string,
  language: Languages,
) => {
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

const downloadTerms = (url: string) => fetch(url).then((res) => res.json())

const saveTerms = (name: string, terms: any) => {
  fs.writeFile(
    `${TRANSLATIONS_LOCATION}/${name}`,
    JSON.stringify(terms, null, 4),
    (err) => {
      if (err) {
        throw err
      }
    },
  )
}

const assembleTermsForLanguage = (language: Languages) =>
  getPoeditorSecrets()
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
  assembleTermsForLanguage(Languages.en)
  assembleTermsForLanguage(Languages.de)
}

main()
