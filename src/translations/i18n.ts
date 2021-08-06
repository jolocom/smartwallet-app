import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { findBestAvailableLanguage } from 'react-native-localize'
import en from './en.json'
import de from './de.json'
import { isJestTesting } from '~/utils/dev'

export enum Locales {
  en = 'en',
  de = 'de',
}

export const localesArr = Object.values(Locales)

const resources = {
  [Locales.en]: { translation: en },
  [Locales.de]: { translation: de },
}

const getSystemLng = () => {
  const systemLng = findBestAvailableLanguage(localesArr)

  if (!systemLng) return Locales.en

  return systemLng.languageTag
}

i18n.use(initReactI18next).init({
  fallbackLng: Locales.en,
  debug: __DEV__ && !isJestTesting(),
  returnEmptyString: false,
  lng: getSystemLng(),
  interpolation: {
    prefix: '${',
    suffix: '}',
    format: (value: string, format, lng) => {
      if (format === 'lowercase') return value.toLowerCase()
      return value
    },
  },
  resources,
})

export default i18n
