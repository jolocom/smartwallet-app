import React, { useCallback, useMemo, useState } from 'react'

import RecordHeader from './RecordHeader'
import RecordItemsList from './RecordItemsList'
import { IRecordHeader, IRecordItemsListProps } from './types'
import { RecordContext } from './context'

interface IRecordComposition {
  Header: React.FC<IRecordHeader>
  ItemsList: React.FC<IRecordItemsListProps>
}
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
