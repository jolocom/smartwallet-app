import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { useAgent } from '~/hooks/sdk'
import { IInteractionDetails } from './types'
import {
  getDateSection,
  filterUniqueById,
  interactionTypeToFlowType,
} from './utils'

export const useHistory = () => {
  const agent = useAgent()

  const getInteractions = (
    take: number,
    skip: number,
    type?: InteractionType,
  ) => {
    return (
      agent.storage.get
        // .interactionTokens({...(type && {type})}, {take, skip})
        .interactionTokens({ ...(type && { type }) })
        .then((tokens) => {
          return tokens.map(({ nonce, issued, interactionType }) => ({
            id: nonce,
            section: getDateSection(new Date(issued)),
            type: interactionTypeToFlowType[interactionType],
          }))
        })
        .then(filterUniqueById)
    )
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
    getInteractionDetails,
  }
}
