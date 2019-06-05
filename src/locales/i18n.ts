const RNLanguages = require('react-native-languages')
import I18n from 'i18n-js'

const de = require('./de').default
const nl = require('./nl').default

I18n.locale = RNLanguages.language.split('-')[0]
I18n.defaultLocale = 'en'
I18n.fallbacks = true
I18n.missingTranslation = scope => scope
I18n.translations = {
  de,
  nl,
}

export const locales = ['en', 'de', 'nl']

const localeSpecificImages = {
  en: {
    "01.jpg": require('src/resources/img/en/01.jpg'),
    "02.jpg": require('src/resources/img/en/02.jpg'),
    "03.jpg": require('src/resources/img/en/03.jpg'),
  },
  de: {
    "01.jpg": require('src/resources/img/de/01.jpg'),
    "02.jpg": require('src/resources/img/de/02.jpg'),
    "03.jpg": require('src/resources/img/de/03.jpg'),
  },
  nl: {
    "01.jpg": require('src/resources/img/nl/01.jpg'),
    "02.jpg": require('src/resources/img/nl/02.jpg'),
    "03.jpg": require('src/resources/img/nl/03.jpg'),
  },
}

export const getI18nImage = (filename: string): File => {
  const locale = locales.includes(I18n.locale)
    ? I18n.locale
    : I18n.defaultLocale

  return localeSpecificImages[locale][filename]
}

export default I18n
