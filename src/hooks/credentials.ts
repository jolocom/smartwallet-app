import { useSelector, useDispatch } from 'react-redux'
import {
  FlowType,
  SignedCredentialWithMetadata,
  CredentialOfferFlowState,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'

import { getInteractionType } from '~/modules/interaction/selectors'
import { SummaryI } from '~/utils/dataMapping' // TODO: find a better place for types
import { useInteraction, useSDK } from './sdk'
import {
  proceedWithTokensCommunication,
  verifyAndGetUpdatedCredentials,
  storeCredentials,
} from '~/utils/credReceive'
import {
  resetInteraction,
  setInteractionDetails,
} from '~/modules/interaction/actions'

export const useHandleFlowSubmit = () => {
  const interaction = useInteraction()
  const interactionType = useSelector(getInteractionType)
  const sdk = useSDK()
  const dispatch = useDispatch()

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
  } else if (interactionType === FlowType.CredentialReceive) {
    return async function receiveCredentials() {
      const summary = interaction.getSummary() as SummaryI<
        CredentialOfferFlowState
      >
      // for this flow type we select all the credentials offered;
      const selectedCredentials: SignedCredentialWithMetadata[] =
        summary.state.offerSummary

      try {
        await proceedWithTokensCommunication(interaction, selectedCredentials)
        const updatedCredentials = await verifyAndGetUpdatedCredentials(
          interaction,
        )
        const allValid = updatedCredentials.every((cred) =>
          Boolean(!cred.invalid),
        )
        const allInvalid = updatedCredentials.every((cred) => cred.invalid)

        if (allValid) {
          // STORE CREDENTIALS
          await storeCredentials(interaction, sdk.storageLib)

          // UPDATE THE STORE WITH NEW CREDENTIALS
          // TODO: add a new module credentials and update VerifiedCredentials there

          // FINISH THE INTERACTION
          dispatch(resetInteraction())
        } else if (allInvalid) {
          // NOTIFY USER ABOUT INVALID CREDENTIALS
          // TODO:

          // FINISH THE INTERACTION
          dispatch(resetInteraction())
        } else {
          // NOTIFY USER ABOUT INVALID CREDENTIALS
          // TODO:

          // UPDATE THE UI WITH UPDATED CREDENTIALS
          const credentials = {
            service_issued: updatedCredentials,
          }
          dispatch(setInteractionDetails({ credentials }))
        }
      } catch (err) {
        console.warn('An error occured while preparing credentials', err)
        console.log({ err })
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
