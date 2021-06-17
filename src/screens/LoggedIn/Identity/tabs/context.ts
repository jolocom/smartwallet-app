import React from 'react'

import { useCustomContext } from '~/hooks/context'
import { ITabsContext } from './types'

export const IdentityTabsContext =
  React.createContext<ITabsContext | undefined>(undefined)
IdentityTabsContext.displayName = 'IdentityTabsContext'

export const useIdentityTabs = useCustomContext(IdentityTabsContext)
