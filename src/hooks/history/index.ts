import { useAgent } from '~/hooks/sdk'
import { IInteractionDetails } from './types'
import {
  getDateSection,
  filterUniqueById,
  interactionTypeToFlowType,
} from './utils'


export const useHistory = () => {
  const agent = useAgent();

  const getInteractions = (take: number, skip: number, type?: string) => {
    return agent.storage.get
      .interactionTokens({}, {take, skip})
      .then((tokens) => 
        tokens
        .map(({ nonce, issued, interactionType }) => ({
          id: nonce,
          section: getDateSection(new Date(issued)),
          type: interactionTypeToFlowType[interactionType],
        }))
      )
      .then(filterUniqueById)
  }

  const getInteractionDetails = async (
    nonce: string,
  ): Promise<IInteractionDetails> => {
    const interaction = await agent.interactionManager.getInteraction(nonce)

    return {
      type: interaction.flow.type,
      issuer: interaction.getSummary().initiator,
      time: new Date(interaction.firstMessage.issued)
        .toTimeString()
        .slice(0, 5),
    }
  }

  return {
    getInteractions,
    getInteractionDetails
  }
}
