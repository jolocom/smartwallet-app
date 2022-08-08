import { useDispatch } from 'react-redux'

import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import { addCredentials } from '~/modules/credentials/actions'
import { ScreenNames } from '~/types/screens'
import { useInitDocuments } from '../documents'
import { useCompleteInteraction } from './useCompleteInteraction'

const useCredentialOfferSubmit = () => {
  const dispatch = useDispatch()
  const {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    storeSelectedCredentials,
  } = useCredentialOfferFlow()
  const { toDocument } = useInitDocuments()
  const { completeInteraction } = useCompleteInteraction(async () => {
    await assembleOfferResponseToken()
    await processOfferReceiveToken()

    const issuedCredentials = await storeSelectedCredentials()
    const displayCredentials = await Promise.all(
      issuedCredentials.map(toDocument),
    )
    dispatch(addCredentials(displayCredentials))

    return {
      screenToNavigate: ScreenNames.Documents,
    }
  })

  return completeInteraction
}

export default useCredentialOfferSubmit
