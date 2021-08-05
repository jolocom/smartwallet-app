import { useTranslation as useI18n } from 'react-i18next'
import { Locales, localesArr } from '~/translations'
import { StorageKeys } from './sdk'
import { Agent } from '@jolocom/sdk'
import { useDispatch } from 'react-redux'
import { setCurrentLanguage } from '~/modules/account/actions'

const useTranslation = () => {
  const { i18n, t } = useI18n()
  const dispatch = useDispatch()

  const currentLanguage = i18n.language

  const storeLanguage = async (lang: Locales, agent: Agent) =>
    agent.storage.store.setting(StorageKeys.language, { id: lang })

  const getStoredLanguage = async (agent: Agent) => {
    const lang = await agent.storage.get.setting(StorageKeys.language)
    if (!lang) return currentLanguage

    return lang.id
  }

  const initStoredLanguage = async (agent: Agent) => {
    const storedLanguage = await getStoredLanguage(agent)

    if (storedLanguage !== currentLanguage) {
      await changeLanguage(storedLanguage, agent)
    }
  }

  const changeLanguage = async (language: Locales, agent: Agent) => {
    if (!localesArr.includes(language)) {
      throw new Error('Language not supported!')
    }

    i18n.changeLanguage(language)
    dispatch(setCurrentLanguage(language))
    storeLanguage(language, agent)
  }

  return { t, i18n, changeLanguage, currentLanguage, initStoredLanguage }
}

export default useTranslation
