import React, { useEffect, useMemo, useState } from 'react'

import { useCustomContext } from '~/hooks/context'
import { useToasts } from '~/hooks/toasts'
import { useHistory } from '~/hooks/history'

import RecordHeader from './RecordHeader'
import RecordItem from './RecordItem'
import RecordItemsList from './RecordItemsList'
import {
  IHistorySection,
  IPreLoadedInteraction,
  IRecordDetails,
  IRecordSteps,
  IRecordStatus,
} from '~/hooks/history/types'
import RecordBody from './RecordBody'
import RecordDropdown from './RecordDropdown'
import RecordStep from './RecordStep'
import RecordFinalStep from './RecordFinalStep'
import RecordBlock from './RecordBlock'

interface IRecordContext {
  activeSection: string
  setActiveSection: React.Dispatch<React.SetStateAction<string>>
  setNextPage: () => void
  loadedInteractions: IPreLoadedInteraction[]
}

export interface IRecordItemProps {
  id: string
}

export interface IRecordItemsListProps {
  sectionGetter: (
    loadedInteractions: IPreLoadedInteraction[],
  ) => IHistorySection[]
}

interface IRecordComposition {
  Header: React.FC
  ItemsList: React.FC<IRecordItemsListProps>
  Item: React.FC<IRecordItemProps>
  Body: React.FC
  Dropdown: React.FC<{ details: IRecordDetails }>
  Step: React.FC<IRecordSteps>
  FinalStep: React.FC<IRecordSteps & { status: IRecordStatus }>
  Block: React.FC<{ details: IRecordDetails | null }>
}

const RecordContext = React.createContext<IRecordContext | undefined>({
  activeSection: '',
  setActiveSection: () => {},
  setNextPage: () => {},
  loadedInteractions: [],
})
RecordContext.displayName = 'RecordContext'

export const useRecord = useCustomContext(RecordContext)

const ITEMS_PER_PAGE = 4

const Record: React.FC & IRecordComposition = ({ children }) => {
  const [allInteractions, setAllInteractions] = useState<
    IPreLoadedInteraction[]
  >([])
  const [loadedInteractions, setLoadedInteractions] = useState<
    IPreLoadedInteraction[]
  >([])
  const [activeSection, setActiveSection] = useState('')
  const [page, setPage] = useState(-1)
  /* TODO: isLoading isn't used at the moment */
  const [isLoading, setLoading] = useState(true)

  const setNextPage = () => setPage((prev) => ++prev)

  const { scheduleErrorWarning } = useToasts()
  const { getInteractions } = useHistory()

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

  const contextValue = useMemo(
    () => ({
      activeSection,
      loadedInteractions,
      setActiveSection,
      setNextPage,
    }),
    [activeSection, JSON.stringify(loadedInteractions)],
  )
  return <RecordContext.Provider value={contextValue} children={children} />
}

Record.Header = RecordHeader
Record.ItemsList = RecordItemsList
Record.Item = RecordItem
Record.Body = RecordBody
Record.Step = RecordStep
Record.Block = RecordBlock
Record.FinalStep = RecordFinalStep
Record.Dropdown = RecordDropdown

export default Record
