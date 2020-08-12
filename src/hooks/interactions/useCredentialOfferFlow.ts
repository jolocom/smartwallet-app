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

  const assembleOfferResponseToken = async () => {
    const summary = interaction.getSummary() as SummaryI<
      CredentialOfferFlowState
    >
    const selectedCredentials: SignedCredentialWithMetadata[] =
      summary.state.offerSummary

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

  return {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    getValidatedCredentials,
    storeSelectedCredentials,
  }
}

export default useCredentialOfferFlow
