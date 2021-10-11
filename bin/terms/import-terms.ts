import fetch from 'node-fetch'
import fs from 'fs'
import { IResponse, Languages, sendPostRequest } from './utils'
import { cloneRepo } from '../utils'

const CURRENT_PATH = process.cwd()
const TRANSLATIONS_LOCATION = `${CURRENT_PATH}/src/translations/`

const downloadTerms = (url: string) => fetch(url).then((res) => res.json())

const saveTerms = (name: string, terms: unknown) => {
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
  sendPostRequest<IResponse<Record<string, string>>>('/projects/export', {
    language,
    type: 'key_value_json',
  })
    .then((res) => {
      if (res) return res.result.url as string
      else throw new Error('Url not found')
    })
    .then(downloadTerms)
    .then((terms) => saveTerms(`${language}.json`, terms))
    .then(() =>
      console.log(`Successfully saved ${language.toUpperCase()} terms`),
    )
    .catch((e) => {
      console.warn(`Failed getting terms for ${language.toUpperCase()}`, e)
    })

const main = async () => {
  await cloneRepo('dev@hetz1.jolocom.io', 'common-secrets')
  await assembleTermsForLanguage(Languages.en)
  await assembleTermsForLanguage(Languages.de)
}

main()
