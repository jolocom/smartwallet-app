import { FlowType } from '@jolocom/sdk'

import { useAgent } from '~/hooks/sdk'
import { IRecordDetails, IPreLoadedInteraction } from '~/types/records'
import { getDateSection } from './utils'
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
      (acc, intx) => {
        const { type } = intx.flow
        const { issued } = intx.lastMessage
        const section = getDateSection(new Date(issued))

        return [
          ...acc,
          {
            id: intx.id,
            section,
            type,
          },
        ]
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
