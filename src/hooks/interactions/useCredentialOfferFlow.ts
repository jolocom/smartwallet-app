import { useInteraction } from '~/hooks/sdk'
import { SummaryI } from '~/utils/dataMapping'
import {
  CredentialOfferFlowState,
  SignedCredentialWithMetadata,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { ServiceIssuedCredI } from '~/types/credentials'

const useCredentialOfferFlow = () => {
  const interaction = useInteraction()

  /**
   * Not accounting for selections. Currently @selectedCredentials are all the
   * credentials that were offered.
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

  const processOfferReceiveToken = async () => {
    const responseToken = interaction
      .getMessages()
      .find(
        ({ interactionType }) =>
          interactionType === InteractionType.CredentialOfferResponse,
      )

    if (!responseToken)
      throw new Error('Could not find the CredentialOfferResponse token')

    const receiveToken = await interaction.send(responseToken)

    if (!receiveToken)
      throw new Error('Failed to fetch the CredentialsReceive token')

    await interaction.processInteractionToken(receiveToken)
  }

  const getValidatedCredentials = (): ServiceIssuedCredI[] => {
    const {
      offerSummary,
      issued,
      credentialsValidity,
    } = interaction.getSummary().state as CredentialOfferFlowState

    return issued.map((cred, i) => {
      const offer = offerSummary.find(({ type }) => type === cred.type[1])
      if (!offer)
        throw new Error('Could not find the offer for received credential')

      return {
        type: offer.type,
        renderInfo: offer.renderInfo,
        invalid: !credentialsValidity[i],
      }
    })
  }

  const storeSelectedCredentials = async () => {
    await interaction.storeSelectedCredentials()
    await interaction.storeCredentialMetadata()
    await interaction.storeIssuerProfile()
  }

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
   * We are renegotiating if there are issued credentials in the state before
   * sending the @CredentalOfferResponse token
   */
  const credentialsAlreadyIssued = () => {
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
