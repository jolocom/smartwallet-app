import { IdentitySummary, FlowType } from 'react-native-jolocom'

import { useAgent } from './sdk'
import { useState, useEffect } from 'react'

enum InteractionStatus {
  pending = 'pending',
  finished = 'finished',
  failed = 'expired',
}

interface InteractionStep {
  title: string
}

export interface IHistoryInteraction {
  type: FlowType
  issuer: IdentitySummary
  // status: InteractionStatus
  // steps: InteractionStep
  time: string
}

const useHistory = (step: number = 4) => {
  const agent = useAgent()

  const [ids, setIds] = useState<string[]>([])
  const [loadedIds, setLoadedIds] = useState<string[]>([])
  const [page, setPage] = useState(0)
  console.log({ ids })

  useEffect(() => {
    getInteractionIds().then((ids) => {
      const uniqueIds = [...new Set(ids)].reverse()
      setIds(uniqueIds)
      loadPageIds(uniqueIds)
    })
  }, [])

  const loadPageIds = async (idsToLoad: string[] = ids) => {
    const pageIdx = idsToLoad.slice(step * page, step * page + step)
    setPage((prev) => ++prev)
    setLoadedIds((prev) => [...prev, ...pageIdx])
  }

  const getInteractionIds = async () =>
    agent.storage.get
      .interactionTokens({})
      .then((tokens) => tokens.map(({ nonce }) => nonce))

  const loadInteraction = async (
    nonce: string,
  ): Promise<IHistoryInteraction> => {
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
    getInteractionIds,
    loadInteraction,
    ids,
    loadPageIds,
    loadedIds,
  }
}

export default useHistory
