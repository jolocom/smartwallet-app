import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { findBestAvailableLanguage } from 'react-native-localize'
// @ts-ignore
import en from './en.json'
// @ts-ignore
import de from './de.json'

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
  debug: __DEV__,
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
