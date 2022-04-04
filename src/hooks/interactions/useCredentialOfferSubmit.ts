import { useDispatch } from 'react-redux'

import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import { ScreenNames } from '~/types/screens'
import { useCompleteInteraction } from './useCompleteInteraction'
import { addCredentials } from '~/modules/credentials/actions'
import { useCredentials } from '../signedCredentials'

const useCredentialOfferSubmit = () => {
  const dispatch = useDispatch()
  const {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    storeSelectedCredentials,
  } = useCredentialOfferFlow()
  const { signedCredentialToUI } = useCredentials()
  const { completeInteraction } = useCompleteInteraction(async () => {
    await assembleOfferResponseToken()
    await processOfferReceiveToken()

    const issuedCredentials = await storeSelectedCredentials()
    const displayCredentials = await signedCredentialToUI(issuedCredentials)
    dispatch(addCredentials(displayCredentials))

    return {
      screenToNavigate: ScreenNames.Documents,
    }
  })

  return completeInteraction
}

export default useCredentialOfferSubmit
