import { FlowType, Interaction } from '@jolocom/sdk'

import { useAgent } from '~/hooks/sdk'
import { IRecordDetails, IPreLoadedInteraction } from '~/types/records'
import { getDateSection, translateRecordConfig } from './utils'
import { RecordAssembler } from '~/middleware/records/recordAssembler'
import useTranslation from '../useTranslation'

export const useHistory = () => {
  const { t } = useTranslation()
  const agent = useAgent()

  const getSectionDetails = (interaction: Interaction) => {
    const { type } = interaction.flow
    const { issued } = interaction.lastMessage
    const section = getDateSection(new Date(issued))

    return {
      type,
      section,
      lastUpdate: issued.toString(),
      id: interaction.id,
    }
  }

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
      (acc, intx) => [...acc, getSectionDetails(intx)],
      [],
    )

    return groupedInteractions
  }

  const updateInteractionRecord = (
    interaction: Interaction,
    records: IPreLoadedInteraction[],
  ) => [
    getSectionDetails(interaction),
    ...records.filter((section) => section.id !== interaction.id),
  ]

  const createInteractionRecord = (
    interaction: Interaction,
    records: IPreLoadedInteraction[],
  ) => [getSectionDetails(interaction), ...records]

  const assembleInteractionDetails = async (
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
      config: translateRecordConfig(t),
    })

    return recordAssembler.getRecordDetails()
  }

  return {
    getInteractions,
    assembleInteractionDetails,
    updateInteractionRecord,
    createInteractionRecord,
  }
}
