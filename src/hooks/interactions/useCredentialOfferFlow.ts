import { useInteraction } from '~/hooks/sdk'
import {
  CredentialOfferFlowState,
  SignedCredentialWithMetadata,
} from '@jolocom/sdk/js/interactionManager/types'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { OfferUICredential } from '~/types/credentials'
import { strings } from '~/translations/strings'
import { useSelector } from 'react-redux'
import { getCounterpartyName } from '~/modules/interaction/selectors'

/**
 * Custom hook that exposes a collection of utils for the Credential Offer interaction
 */
const useCredentialOfferFlow = () => {
  const interaction = useInteraction()
  const serviceName = useSelector(getCounterpartyName)

  /**
   * Assembles a @CredentialOfferResponse token with the credential types that
   * were selected by the user. Currently not accounting for selections, so
   * @selectedCredentials are all the credentials that were offered.
   */
  const assembleOfferResponseToken = async () => {
    const state = interaction.getSummary().state as CredentialOfferFlowState

    const selectedCredentials: SignedCredentialWithMetadata[] =
      state.offerSummary

    const responseToken = await interaction.createCredentialOfferResponseToken(
      selectedCredentials,
    )
    await interaction.processInteractionToken(responseToken)
  }

  /**
   * Sends the @CredentialOfferResponse token and receives as a response the
   * @CredentialsReceive token, which is finally processed by the InteractionManager.
   */
  const processOfferReceiveToken = async () => {
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
  const getValidatedCredentials = (): OfferUICredential[] => {
    const { initiator, state } = interaction.getSummary()
    const {
      offerSummary,
      issued,
      credentialsValidity,
    } = state as CredentialOfferFlowState

    return issued.map((cred, i) => {
      const offer = offerSummary.find(({ type }) => type === cred.type[1])
      if (!offer)
        throw new Error('Could not find the offer for received credential')

      return {
        type: offer.type,
        renderInfo: offer.renderInfo,
        issuer: initiator,
        invalid: !credentialsValidity[i],
      }
    })
  }

  /**
   * Stores the @SignedCredentials, @CredentialMetadata and the counterparty's @IdentitySummary
   * in the SDK's TypeORM storage.
   */
  const storeSelectedCredentials = async () => {
    await interaction.storeSelectedCredentials()
    await interaction.storeCredentialMetadata()
    await interaction.storeIssuerProfile()
  }

  /**
   * Checks if any of the offered credentials are already available in the storage (same @id).
   * An unlikely scenario, which is indicative of something being wrong on the @counterparty's
   * side (issuing credentials with the same @id), or the wallet's side (trying to store the same
   * credential multiple times).
   */
  const checkDuplicates = async () => {
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
  const credentialsAlreadyIssued = () => {
    const state = interaction.getSummary().state as CredentialOfferFlowState
    return state.issued.length
  }

  // NOTE: Not sure this fits here. Maybe we should have a separation between SDK
  // enabling hooks and UX/UI related ones. Same thing is relevant to @useCredentialShareFlow
  const getHeaderText = () => {
    const title = strings.INCOMING_OFFER
    const description = strings.SERVICE_SENT_YOUR_WALLET_THE_FOLLOWING_DOCUMENTS(
      serviceName,
    )
    return { title, description }
  }

  return {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    getValidatedCredentials,
    storeSelectedCredentials,
    credentialsAlreadyIssued,
    checkDuplicates,
    getHeaderText,
  }
}

export default useCredentialOfferFlow
