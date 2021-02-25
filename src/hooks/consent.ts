import { useDispatch, useSelector } from 'react-redux'

import { useAgent, StorageKeys } from './sdk'
import { termsOfServiceDE } from '~/translations/terms'
import { showTermsConsent } from '~/modules/account/actions'
import { shouldShowTermsConsent } from '~/modules/account/selectors'
import { hashString } from '~/utils/crypto'

const useTermsConsent = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const shouldShowConsent = useSelector(shouldShowTermsConsent)

  const checkConsent = async () => {
    const storedConsent = (await agent.storage.get.setting(
      StorageKeys.termsConsent,
    )) as { hash: string }

    if (!storedConsent) return dispatch(showTermsConsent(true))

    const storedHash = storedConsent.hash
    const currentHash = hashString(termsOfServiceDE)
    if (currentHash !== storedHash) return dispatch(showTermsConsent(true))
  }

  const acceptConsent = async () => {
    const termsHash = hashString(termsOfServiceDE)

    await agent.storage.store.setting(StorageKeys.termsConsent, {
      hash: termsHash,
    })
    dispatch(showTermsConsent(false))
  }

  return { checkConsent, acceptConsent, shouldShowConsent }
}

export default useTermsConsent
