import crypto from 'crypto'
import { useDispatch, useSelector } from 'react-redux'

import { useAgent, StorageKeys } from './sdk'
import { termsOfServiceDE } from '~/translations/terms'
import { showTermsConsent } from '~/modules/account/actions'
import { shouldShowTermsConsent } from '~/modules/account/selectors'

const useTermsConsent = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const shouldShowConsent = useSelector(shouldShowTermsConsent)

  //TODO: move to utils
  const hashString = (text: string) => {
    return crypto.createHash('sha256').update(text).digest('hex')
  }

  const checkConsent = async () => {
    const storedConsent = (await agent.storage.get.setting(
      StorageKeys.termsConsent,
    )) as { hash: string }

    if (!storedConsent) dispatch(showTermsConsent(true))

    const storedHash = storedConsent.hash
    const currentHash = hashString(termsOfServiceDE)
    if (currentHash !== storedHash) dispatch(showTermsConsent(true))
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
