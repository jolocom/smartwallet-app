import { useSelector, useDispatch } from 'react-redux'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import { getInteractionType } from '~/modules/interaction/selectors'
import {
  resetInteraction,
  setInteractionDetails,
} from '~/modules/interaction/actions'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'

export const useHandleFlowSubmit = () => {
  const interactionType = useSelector(getInteractionType)
  const dispatch = useDispatch()
  const {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    getValidatedCredentials,
    storeSelectedCredentials,
  } = useCredentialOfferFlow()

  if (interactionType === FlowType.Authentication) {
    return function authenticate() {
      // TODO: add onAuthenticate functionality here
    }
  } else if (interactionType === FlowType.Authorization) {
    return function authorize() {
      // TODO: add onAuthorization functionality here
    }
  } else if (interactionType === FlowType.CredentialShare) {
    return function shareCredentials() {
      // TODO: add onCredShare functionality here
    }
  } else if (interactionType === FlowType.CredentialOffer) {
    return async () => {
      try {
        /**
         * if(renegotiation) {
         *    return storeSelectedCredentials()
         *    dispatch(resetInteraction())
         * }
         */

        await assembleOfferResponseToken()
        await processOfferReceiveToken()

        const validatedCredentials = getValidatedCredentials()
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
      }
    }
  } else {
    return function () {
      console.log(
        'No handle submit function is provided for this interaction type:',
        interactionType,
      )
    }
  }
}
