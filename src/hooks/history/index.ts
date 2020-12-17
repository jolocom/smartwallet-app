import { useMemo } from 'react'
import { useState, useEffect } from 'react'

import { useAgent } from '~/hooks/sdk'
import { IInteractionWithSection, IInteractionDetails } from './types'
import {
  groupBySection,
  getDateSection,
  filterUniqueById,
  interactionTypeToFlowType,
} from './utils'
import { FlowType } from '@jolocom/sdk'

const useHistory = (step: number = 4) => {
  const agent = useAgent()

  const [isLoading, setLoading] = useState(true)
  const [interactions, setInteractions] = useState<IInteractionWithSection[]>(
    [],
  )
  const [loadedInteractions, setLoadedInteractions] = useState<
    IInteractionWithSection[]
  >([])
  const [page, setPage] = useState(0)
  const setNextPage = () => setPage((prev) => ++prev)

  const groupedInteractions = useMemo(
    () => groupBySection(loadedInteractions),
    [loadedInteractions],
  )

  const groupedReceiveInteractions = useMemo(
    () =>
      groupBySection(
        loadedInteractions.filter((g) => g.type === FlowType.CredentialOffer),
      ),
    [loadedInteractions],
  )

  const groupedShareInteractions = useMemo(
    () =>
      groupBySection(
        loadedInteractions.filter((g) => g.type === FlowType.CredentialShare),
      ),
    [loadedInteractions],
  )

  useEffect(() => {
    getInteractions().then((sections) => {
      setInteractions(sections)
      setNextPage()
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const pageInteractions = interactions.slice(step * page, step * page + step)
    setLoadedInteractions((prev) => [...prev, ...pageInteractions])
  }, [page])

  const getInteractions = () =>
    agent.storage.get
      .interactionTokens({})
      .then((tokens) =>
        tokens
          .map(({ nonce, issued, interactionType }) => ({
            id: nonce,
            section: getDateSection(new Date(issued)),
            type: interactionTypeToFlowType[interactionType],
          }))
          .reverse(),
      )
      .then(filterUniqueById)

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
    getInteractionDetails,
    setNextPage,
    groupedInteractions,
    groupedShareInteractions,
    groupedReceiveInteractions,
    isLoading,
  }
}

export default useHistory
