import { useSelector } from 'react-redux'
import {
  FlowType,
  SignedCredentialWithMetadata,
  CredentialOfferFlowState,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'

import { getInteractionType } from '~/modules/interaction/selectors'
import { SummaryI } from '~/utils/dataMapping' // TODO: find a better place for types
import { useInteraction } from './sdk'
import { JSONWebToken } from '@jolocom/sdk'

export const useHandleFlowSubmit = () => {
  const interaction = useInteraction()
  const interactionType = useSelector(getInteractionType)

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
      console.log({ selectedCredentials })
      console.log({ summary })

      try {
        // RES: prepare the responseToken to be send to a service
        const responseToken = await interaction.createCredentialOfferResponseToken(
          selectedCredentials,
        )
        // RES: process the response Token: TODO: figure out what is actually done here
        await interaction.processInteractionToken(responseToken)

        // RECEIVE: prepare the receive token containing signed credentials: payload.interactionToken.signedCredentials
        const credentialsToken = await interaction.send(responseToken)
        // RECEIVE: process the recive Token: TODO: figure out what is actually done here
        await interaction.processInteractionToken(credentialsToken)

        console.log({ credentialsToken })

        // NOW this will container: issued: SignedCredential[]
        const updatedSummary = interaction.getSummary()
        console.log({ updatedSummary })

        // check weather credentials offered exist in the wallet as well;
        // const duplicates = await isCredentialStored(selectedCredentials, id => interaction.getStoredCredentialById(id))
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

// const isCredentialStored = async (
//   offer: SignedCredentialWithMetadata[],
//   getCredential: (id: string) => Promise<SignedCredential[]>,
// ) => {
//   await getCredential()
//   return Promise.all(
//     offer.map(async ({ signedCredential }) =>
//       signedCredential
//         ? !isEmpty(await getCredential(signedCredential.id))
//         : false,
//     ),
//   )
// }
