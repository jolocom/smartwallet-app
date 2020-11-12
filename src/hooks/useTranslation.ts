import { useTranslation as useI18n } from 'react-i18next'
import { Locales, localesArr } from '~/translations'

const useTranslation = () => {
  const { i18n, t } = useI18n()

  const currentLanguage = i18n.language

  const changeLanguage = (language: Locales) => {
    if (!localesArr.includes(language))
      throw new Error('Language not supported!')

    i18n.changeLanguage(language)
  }

  return { t, i18n, changeLanguage, currentLanguage }
}

export default useTranslation
