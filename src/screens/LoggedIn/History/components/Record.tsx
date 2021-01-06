import React, { useMemo, useState } from 'react'

import { useCustomContext } from '~/hooks/context'

import RecordHeader from './RecordHeader'
import RecordItem from './RecordItem'
import RecordItemsList from './RecordItemsList'

interface IRecordContext {
  activeSection: string
  setActiveSection: React.Dispatch<React.SetStateAction<string>>
}

export interface IRecordItemProps {
  id: string
}

export interface IRecordItemsListProps {
  type?: string /* TODO: this doesn't help knowing what type to pass, should be more specific */
}

interface IRecordComposition {
  Header: React.FC
  ItemsList: React.FC<IRecordItemsListProps>
  Item: React.FC<IRecordItemProps>
}

const RecordContext = React.createContext<IRecordContext | undefined>({
  activeSection: '',
  setActiveSection: () => {},
})
RecordContext.displayName = 'RecordContext'

export const useRecord = useCustomContext(RecordContext)

const Record: React.FC & IRecordComposition = ({ children }) => {
  const [activeSection, setActiveSection] = useState('')

  const contextValue = useMemo(
    () => ({
      activeSection,
      setActiveSection,
    }),
    [activeSection],
  )
  return <RecordContext.Provider value={contextValue} children={children} />
}

Record.Header = RecordHeader
Record.ItemsList = RecordItemsList
Record.Item = RecordItem

export default Record
