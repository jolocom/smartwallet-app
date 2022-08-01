import {
  CredentialOfferFlowState,
  SignedCredentialWithMetadata,
} from '@jolocom/sdk/js/interactionManager/types'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'

import { useInteraction } from './handlers'
import { useAgent } from '../sdk'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

/**
 * Custom hook that exposes a collection of utils for the Credential Offer interaction
 */
const useCredentialOfferFlow = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()

  /**
   * Assembles a @CredentialOfferResponse token with the credential types that
   * were selected by the user. Currently not accounting for selections, so
   * @selectedCredentials are all the credentials that were offered.
   */
  const assembleOfferResponseToken = async () => {
    const interaction = await getInteraction()
    const state = interaction.getSummary().state as CredentialOfferFlowState

    const selectedCredentials: SignedCredentialWithMetadata[] =
      state.offerSummary

    const responseToken = await interaction.createCredentialOfferResponseToken(
      selectedCredentials,
    )
    await agent.processJWT(responseToken)
  }

  /**
   * Sends the @CredentialOfferResponse token and receives as a response the
   * @CredentialsReceive token, which is finally processed by the InteractionManager.
   */
  const processOfferReceiveToken = async () => {
    const interaction = await getInteraction()
    const responseToken = interaction
      .getMessages()
      .find(
        ({ interactionType }) =>
          interactionType === InteractionType.CredentialOfferResponse,
      )

    if (!responseToken)
      throw new Error('Could not find the CredentialOfferResponse token')

    await interaction.send(responseToken)
  }

  /**
   * Stores the @SignedCredentials, @CredentialMetadata and the counterparty's @IdentitySummary
   * in the SDK's TypeORM storage.
   */
  const storeSelectedCredentials = async () => {
    const interaction = await getInteraction()
    const signedCredentials: SignedCredential[] =
      await interaction.storeSelectedCredentials()
    return signedCredentials
  }

  return {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    storeSelectedCredentials,
  }
}

export default useCredentialOfferFlow
