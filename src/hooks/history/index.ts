import { FlowType, Interaction } from '@jolocom/sdk'

import { useAgent } from '~/hooks/sdk'
import { IRecordDetails, IPreLoadedInteraction } from '~/types/records'
import { getDateSection } from './utils'
import { RecordAssembler } from '~/middleware/records/recordAssembler'
import { recordConfig } from '~/config/records'
import { useEffect } from 'react'

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
            lastUpdate: issued.toString(),
          },
        ]
      },
      [],
    )

    return groupedInteractions
  }

  const updateInteractionRecord = (
    interaction: Interaction,
    records: IPreLoadedInteraction[],
  ) => {
    const { type } = interaction.flow
    const { issued } = interaction.lastMessage
    const section = getDateSection(new Date(issued))

    records = records.filter((section) => section.id !== interaction.id)

    return [
      { id: interaction.id, section, type, lastUpdate: issued.toString() },
      ...records,
    ]
  }

  const createInteractionRecord = (
    interaction: Interaction,
    records: IPreLoadedInteraction[],
  ) => {
    const { type } = interaction.flow
    const { issued } = interaction.lastMessage
    const section = getDateSection(new Date(issued))

    return [
      { id: interaction.id, section, type, lastUpdate: issued.toString() },
      ...records,
    ]
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
    updateInteractionRecord,
    createInteractionRecord,
  }
}

enum HistoryEvents {
  updated = 'updated',
  created = 'created',
}

const historyHookFactory =
  (event: HistoryEvents) => (cb: (id: Interaction) => void) => {
    const agent = useAgent()

    useEffect(() => {
      const unsubscribe = agent.interactionManager.on(event, (interaction) => {
        cb(interaction)
      })

      return unsubscribe
    }, [])
  }

export const useHistoryUpdate = historyHookFactory(HistoryEvents.updated)
export const useHistoryCreate = historyHookFactory(HistoryEvents.created)
