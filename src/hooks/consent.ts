import { useDispatch } from 'react-redux'
import { Agent } from 'react-native-jolocom'

import { StorageKeys } from './sdk'
import { termsOfServiceDE } from '~/translations/terms'
import {
  setTermsConsentOutdatedness,
  setTermsConsentVisibility,
} from '~/modules/account/actions'
import { hashString } from '~/utils/crypto'

const useTermsConsent = () => {
  const dispatch = useDispatch()

  const checkConsent = async (agent: Agent) => {
    const storedConsent = (await agent.storage.get.setting(
      StorageKeys.termsConsent,
    )) as { hash: string }
    if (!storedConsent) return dispatch(setTermsConsentOutdatedness(true))

    const storedHash = storedConsent.hash
    const currentHash = hashString(termsOfServiceDE)
    if (currentHash !== storedHash)
      return dispatch(setTermsConsentOutdatedness(true))
  }

  const acceptConsent = async (agent: Agent) => {
    const termsHash = hashString(termsOfServiceDE)

    await agent.storage.store.setting(StorageKeys.termsConsent, {
      hash: termsHash,
    })
    dispatch(setTermsConsentVisibility(false))
  }

  return { checkConsent, acceptConsent }
}

export default useTermsConsent
