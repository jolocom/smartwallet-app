import { useDispatch } from 'react-redux'

import {
  resetInteraction,
  setInteractionDetails,
} from '~/modules/interaction/actions'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import { useSyncStorageCredentials } from '~/hooks/credentials'
import { showNotification } from './utils'

const useCredentialOfferSubmit = () => {
  const dispatch = useDispatch()
  const {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    getValidatedCredentials,
    storeSelectedCredentials,
    credentialsAlreadyIssued,
    checkDuplicates,
  } = useCredentialOfferFlow()
  const syncCredentials = useSyncStorageCredentials()

  return async () => {
    try {
      if (await credentialsAlreadyIssued()) {
        await storeSelectedCredentials()
        await syncCredentials()
        return dispatch(resetInteraction())
      }

      await assembleOfferResponseToken()
      await processOfferReceiveToken()

      // NOTE: Uncomment the line below to test the duplicates edge-case
      // await storeSelectedCredentials()
      const anyDuplicates = await checkDuplicates()
      if (anyDuplicates)
        throw new Error(
          "Duplicates were found. Can't proceed with the interaction",
        )

      const validatedCredentials = await getValidatedCredentials()
      const allValid = validatedCredentials.every((cred) => !cred.invalid)
      const allInvalid = validatedCredentials.every((cred) => cred.invalid)

      if (allValid) {
        await storeSelectedCredentials()
        await syncCredentials()
        showNotification('Documents stored successfully')
        //TODO: update store credentials with the new ones

        dispatch(resetInteraction())
      } else if (allInvalid) {
        showNotification('All the documents are corrupted')
        //TODO: dispatch "interaction failed" notification

        dispatch(resetInteraction())
      } else {
        //TODO: dispatch renegotiation notification

        const credentials = {
          service_issued: validatedCredentials,
        }
        dispatch(setInteractionDetails({ credentials }))
        showNotification('Renegotiating')
      }
    } catch (err) {
      //TODO: dispatch error notification
      showNotification('Interaction failed', err.message)

      console.log({ err })
      dispatch(resetInteraction())
      throw new Error(err)
    }
  }
}

export default useCredentialOfferSubmit
