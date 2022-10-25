import { useDispatch } from 'react-redux'

import { useInitDocuments } from '~/hooks/documents'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import { addCredentials } from '~/modules/credentials/actions'
import { ScreenNames } from '~/types/screens'
import { useRedirect } from '../navigation'
import { useCompleteInteraction } from './useCompleteInteraction'

const useCredentialOfferSubmit = () => {
  const dispatch = useDispatch()
  const redirect = useRedirect()
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

    return redirect(ScreenNames.Documents, {
      ids: issuedCredentials.map((cred) => cred.id),
    })
  })

  return completeInteraction
}

export default useCredentialOfferSubmit
