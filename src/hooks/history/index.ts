import { FlowType } from '@jolocom/sdk'

import { useAgent } from '~/hooks/sdk'
import { IRecordDetails, IPreLoadedInteraction } from '~/types/records'
import { getDateSection, interactionTypeToFlowType } from './utils'
import { RecordAssembler } from '~/middleware/records/recordAssembler'
import { recordConfig } from '~/config/records'

export const useHistory = () => {
  const agent = useAgent()

  const getInteractions = async (
    take: number,
    skip: number,
    flows?: FlowType[],
  ) => {
    const allInteractions = await agent.interactionManager.listInteractions({
      take,
      skip,
      flows,
      reverse: true,
    })

    const groupedInteractions = allInteractions.reduce<IPreLoadedInteraction[]>(
      (mappedIntxs, intx) => {
        const { nonce, issued, interactionType } = intx.firstMessage
        const interactionBySection = {
          id: nonce,
          section: getDateSection(new Date(issued)),
          type: interactionTypeToFlowType[interactionType],
        }
        return [...mappedIntxs, interactionBySection]
      },
      [],
    )

    return groupedInteractions
  }

  const getInteractionDetails = async (
    nonce: string,
  ): Promise<IRecordDetails> => {
    const interaction = await agent.interactionManager.getInteraction(nonce)
    const messageTypes = interaction.getMessages().map((m) => m.interactionType)
    const { expires, issued } = interaction.lastMessage
    const recordAssembler = new RecordAssembler({
      messageTypes,
      flowType: interaction.flow.type,
      summary: interaction.getSummary(),
      lastMessageDate: issued,
      expirationDate: expires,
      config: recordConfig,
    })

    return recordAssembler.getRecordDetails()
  }

  return {
    getInteractions,
    getInteractionDetails,
  }
}
