const RNLanguages = require('react-native-languages')
import I18n from 'i18n-js'

import de from './de'

// const de = require('./de').default
const nl = require('./nl').en

I18n.locale = RNLanguages.language.split('-')[0]
I18n.defaultLocale = 'en'
I18n.fallbacks = true
I18n.missingTranslation = scope => scope
I18n.translations = {
  de,
  nl,
}

export const locales = ['en', 'de', 'nl']

export const getI18nImage = (fileName: string): File => {
  const locale = locales.includes(I18n.locale)
    ? I18n.locale
    : I18n.defaultLocale

  return require(`src/resources/img/${locale}/${fileName}`)
}

export default I18n
