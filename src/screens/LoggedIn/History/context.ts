import React from 'react'
import { useCustomContext } from '~/hooks/context'

export interface IRecordContext {
  activeSection: Record<string, string>
  updateActiveSection: (id: string, value: string) => void
}

export const RecordContext = React.createContext<IRecordContext | undefined>({
  activeSection: {},
  updateActiveSection: () => {},
})
RecordContext.displayName = 'RecordContext'

export const useRecord = useCustomContext(RecordContext)
