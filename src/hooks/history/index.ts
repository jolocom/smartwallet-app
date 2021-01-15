import { FlowType } from '@jolocom/sdk';
import { useAgent } from '~/hooks/sdk'
import { IInteractionDetails, IPreLoadedInteraction } from './types'
import {
  getDateSection,
  interactionTypeToFlowType,
} from './utils'

export const useHistory = () => {
  const agent = useAgent();

  const getInteractions = async (take: number, skip: number, flows?: FlowType[]) => {
    const allInteractions = await agent.interactionManager.listInteractions({ take, skip, flows, reverse: true });

    const groupedInteractions = allInteractions.reduce<IPreLoadedInteraction[]>((mappedIntxs, intx) => {
      const { nonce, issued, interactionType } = intx.firstMessage;
      const interactionBySection = { id: nonce, section: getDateSection(new Date(issued)), type: interactionTypeToFlowType[interactionType] }
      return [...mappedIntxs, interactionBySection]
    }, [])

    return groupedInteractions;
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
