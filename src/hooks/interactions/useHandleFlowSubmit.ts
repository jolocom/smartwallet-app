import { useSelector, useDispatch } from 'react-redux'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import { getInteractionType } from '~/modules/interaction/selectors'
import {
  resetInteraction,
  setInteractionDetails,
} from '~/modules/interaction/actions'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'

export const useHandleFlowSubmit = (): (() => Promise<any>) => {
  const interactionType = useSelector(getInteractionType)
  const dispatch = useDispatch()
  const {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    getValidatedCredentials,
    storeSelectedCredentials,
    isRenegotiation,
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
        if (isRenegotiation()) {
          await storeSelectedCredentials()
          return dispatch(resetInteraction())
        }

        await assembleOfferResponseToken()
        await processOfferReceiveToken()

        const validatedCredentials = getValidatedCredentials()
        console.log(validatedCredentials.map((cred) => cred.invalid))
        const allValid = validatedCredentials.every((cred) => !cred.invalid)
        const allInvalid = validatedCredentials.every((cred) => cred.invalid)

        if (allValid) {
          await storeSelectedCredentials()
          //TODO: update store credentials with the new ones

          dispatch(resetInteraction())
        } else if (allInvalid) {
          //TODO: dispatch "interaction failed" notification

          dispatch(resetInteraction())
        } else {
          //TODO: dispatch renegotiation notification
          //TODO: dispatch isRenegotiation

          const credentials = {
            service_issued: validatedCredentials,
          }
          dispatch(setInteractionDetails({ credentials }))
        }
      } catch (err) {
        //TODO: dispatch error notification

        console.log({ err })
        dispatch(resetInteraction())
        throw new Error(err)
      }
    }
  } else {
    throw new Error('Interaction Type not found')
  }
}
