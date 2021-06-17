import React from 'react'
import { useCustomContext } from '~/hooks/context'
import { ITabsContext } from './types'

export const TabsContext =
  React.createContext<ITabsContext | undefined>(undefined)
TabsContext.displayName = 'TabsContext'

export const useTabs = useCustomContext(TabsContext)
