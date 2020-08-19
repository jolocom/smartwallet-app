import { useSelector, useDispatch } from 'react-redux'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import { getInteractionType } from '~/modules/interaction/selectors'
import {
  resetInteraction,
  setInteractionDetails,
} from '~/modules/interaction/actions'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import { Alert } from 'react-native'

export const useHandleFlowSubmit = (): (() => Promise<any>) => {
  const interactionType = useSelector(getInteractionType)
  const dispatch = useDispatch()
  const {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    getValidatedCredentials,
    storeSelectedCredentials,
    credentialsAlreadyIssued,
    checkDuplicates,
  } = useCredentialOfferFlow()

  if (interactionType === FlowType.Authentication) {
    return async function authenticate() {
      // TODO: add onAuthenticate functionality here
    }
  } else if (interactionType === FlowType.Authorization) {
    return async function authorize() {
      // TODO: add onAuthorization functionality here
    }
  } else if (interactionType === FlowType.CredentialShare) {
    return async function shareCredentials() {
      // TODO: add onCredShare functionality here
    }
  } else if (interactionType === FlowType.CredentialOffer) {
    return async () => {
      try {
        if (credentialsAlreadyIssued()) {
          await storeSelectedCredentials()
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

        const validatedCredentials = getValidatedCredentials()
        const allValid = validatedCredentials.every((cred) => !cred.invalid)
        const allInvalid = validatedCredentials.every((cred) => cred.invalid)

        if (allValid) {
          await storeSelectedCredentials()
          Alert.alert('Documents stored successfully')
          //TODO: update store credentials with the new ones

          dispatch(resetInteraction())
        } else if (allInvalid) {
          Alert.alert('All the documents are corrupted')
          //TODO: dispatch "interaction failed" notification

          dispatch(resetInteraction())
        } else {
          //TODO: dispatch renegotiation notification

          const credentials = {
            service_issued: validatedCredentials,
          }
          dispatch(setInteractionDetails({ credentials }))
          Alert.alert('Renegotiating')
        }
      } catch (err) {
        //TODO: dispatch error notification
        Alert.alert('Interaction failed', err.message)

        console.log({ err })
        dispatch(resetInteraction())
        throw new Error(err)
      }
    }
  } else {
    throw new Error('Interaction Type not found')
  }
}
