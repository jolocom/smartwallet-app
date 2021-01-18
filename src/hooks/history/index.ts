import { FlowType } from '@jolocom/sdk'

import { useAgent } from '~/hooks/sdk'
import { IRecordDetails, IPreLoadedInteraction } from '~/types/records'
import { getDateSection, interactionTypeToFlowType } from './utils'
import { RecordManager } from '~/middleware/records/recordManager'
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
    const recordManager = new RecordManager(interaction, recordConfig)

    return recordManager.getRecordDetails()
  }

  return {
    getInteractions,
    getInteractionDetails,
  }
}
