import { useMemo } from 'react'
import { useState, useEffect } from 'react'
import { FlowType } from '@jolocom/sdk'

import { useAgent } from '~/hooks/sdk'
import { IPreLoadedInteraction, IInteractionDetails } from './types'
import {
  groupBySection,
  getDateSection,
  filterUniqueById,
  interactionTypeToFlowType,
} from './utils'
import { useToasts } from '../toasts'

const ITEMS_PER_PAGE = 4

const useHistory = () => {
  const agent = useAgent()
  const { scheduleErrorWarning } = useToasts()

  const [isLoading, setLoading] = useState(true)
  const [allInteractions, setAllInteractions] = useState<
    IPreLoadedInteraction[]
  >([])
  const [loadedInteractions, setLoadedInteractions] = useState<
    IPreLoadedInteraction[]
  >([])
  const [page, setPage] = useState(0)
  const setNextPage = () => setPage((prev) => ++prev)

  const getGroupedInteractions = (
    appliedFn: (interact: IPreLoadedInteraction[]) => IPreLoadedInteraction[],
  ) =>
    useMemo(() => groupBySection(appliedFn(loadedInteractions)), [
      JSON.stringify(loadedInteractions),
    ])

  const groupedAllInteractions = getGroupedInteractions((n) => n)
  const groupedReceiveInteractions = getGroupedInteractions((n) =>
    n.filter((g) => g.type === FlowType.CredentialOffer),
  )
  const groupedShareInteractions = getGroupedInteractions((n) =>
    n.filter((g) => g.type === FlowType.CredentialShare),
  )

  useEffect(() => {
    getInteractions()
      .then((all) => {
        setAllInteractions(all)
        setNextPage()
        setLoading(false)
      })
      .catch(scheduleErrorWarning)
  }, [])

  useEffect(() => {
    const pageInteractions = allInteractions.slice(
      ITEMS_PER_PAGE * page,
      ITEMS_PER_PAGE * page + ITEMS_PER_PAGE,
    )
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
    groupedAllInteractions,
    groupedShareInteractions,
    groupedReceiveInteractions,
    isLoading,
  }
}

export default useHistory
