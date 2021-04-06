import {
  CredentialOfferFlowState,
  SignedCredentialWithMetadata,
} from '@jolocom/sdk/js/interactionManager/types'
import { CredentialOfferFlow } from '@jolocom/sdk/js/interactionManager/credentialOfferFlow'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'

import { OfferedCredential, CredentialCategories } from '~/types/credentials'
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
   * Gets the credential validation results from the @InteractionManager.
   */
  const getValidatedCredentials = async (): Promise<OfferedCredential[]> => {
    const interaction = await getInteraction()
    const { state } = interaction.getSummary()
    const {
      offerSummary,
      issued,
      credentialsValidity,
    } = state as CredentialOfferFlowState
    const issuanceResult = (interaction.flow as CredentialOfferFlow).getIssuanceResult()

    return issued.map((cred, i) => {
      const offer = offerSummary.find(({ type }) => type === cred.type[1])
      if (!offer)
        throw new Error('Could not find the offer for received credential')

      const isInvalid =
        !credentialsValidity[i] ||
        !!issuanceResult[i].validationErrors.invalidIssuer ||
        !!issuanceResult[i].validationErrors.invalidSubject

      return {
        // NOTE: making type as array of strings for consistency
        // offerSummary type is different from SignedCredential type of type property
        type: ['', offer.type],
        category:
          offer.renderInfo?.renderAs === 'document'
            ? CredentialCategories.document
            : CredentialCategories.other,
        invalid: isInvalid,
        name: offer.credential?.name ?? '',
      }
    })
  }

  /**
   * Stores the @SignedCredentials, @CredentialMetadata and the counterparty's @IdentitySummary
   * in the SDK's TypeORM storage.
   */
  const storeSelectedCredentials = async () => {
    const interaction = await getInteraction()
    const signedCredentials: SignedCredential[] = await interaction.storeSelectedCredentials()
    await interaction.storeCredentialMetadata()
    await interaction.storeIssuerProfile()
    return signedCredentials
  }

  /**
   * Checks if any of the offered credentials are already available in the storage (same @id).
   * An unlikely scenario, which is indicative of something being wrong on the @counterparty's
   * side (issuing credentials with the same @id), or the wallet's side (trying to store the same
   * credential multiple times).
   */
  const checkDuplicates = async () => {
    const interaction = await getInteraction()
    const state = interaction.getSummary().state as CredentialOfferFlowState
    const duplicates = await Promise.all(
      state.issued.map(async (cred) => {
        const stored = await interaction.getStoredCredentialById(cred.id)
        return !!stored.length
      }),
    )
    return duplicates.every((c) => c)
  }

  /**
   * Checks if a @CredentialsReceive token was already processed. Used to indicate
   * whether renegotiation is in progress. In the future can use a flag in the store
   * to indicate renegotiation.
   */
  const credentialsAlreadyIssued = async () => {
    const interaction = await getInteraction()
    const state = interaction.getSummary().state as CredentialOfferFlowState
    return state.issued.length
  }

  return {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    getValidatedCredentials,
    storeSelectedCredentials,
    credentialsAlreadyIssued,
    checkDuplicates,
  }
}

export default useCredentialOfferFlow
