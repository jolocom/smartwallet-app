import React, { useCallback, useMemo, useState } from 'react'
import { FlowType } from '@jolocom/sdk'

import { useCustomContext } from '~/hooks/context'

import RecordHeader from './RecordHeader'
import RecordItemsList from './RecordItemsList'

interface IRecordContext {
  activeSection: Record<string, string>
  updateActiveSection: (id: string, value: string) => void
}

export interface IRecordHeader {
  title?: string
  testID?: string
}

export interface IRecordItemProps {
  id: string
  isFocused: boolean
  onDropdown: () => void
}

export interface IRecordItemsListProps {
  id: string
  flows?: FlowType[]
}

interface IRecordComposition {
  Header: React.FC<IRecordHeader>
  ItemsList: React.FC<IRecordItemsListProps>
}

const RecordContext = React.createContext<IRecordContext | undefined>({
  activeSection: {},
  updateActiveSection: () => {},
})
RecordContext.displayName = 'RecordContext'

export const useRecord = useCustomContext(RecordContext)

const Record: React.FC & IRecordComposition = ({ children }) => {
  const [activeSection, setActiveSection] = useState({})

  const updateActiveSection = useCallback((id: string, value: string) => {
    setActiveSection({ [id]: value })
  }, [])

  const contextValue = useMemo(
    () => ({
      activeSection,
      updateActiveSection,
    }),
    [JSON.stringify(activeSection)],
  )
  return <RecordContext.Provider value={contextValue} children={children} />
}

Record.Header = RecordHeader
Record.ItemsList = RecordItemsList

export default Record
