import React, { useMemo, useState } from 'react'

import IdentityTab, { IdentityTabType } from './IdentityTab'
import { useCustomContext } from '~/hooks/context'
import IdentityTabsHeader from './IdentityTabsHeader'

interface ITabsContext {
  activeTab: string | undefined
  setActiveTab: (value: string) => void
}

const TabsContext = React.createContext<ITabsContext | undefined>(undefined)
TabsContext.displayName = 'IdentityTabsContext'

interface IIdentityTabs {
  initialTab?: string
}

interface ITabsComposition {
  Tab: IdentityTabType
  Header: React.FC
}

const IdentityTabs: React.FC<IIdentityTabs> & ITabsComposition = ({
  initialTab,
  children,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab)

  const contextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab,
    }),
    [activeTab],
  )

  return <TabsContext.Provider value={contextValue} children={children} />
}

IdentityTabs.Header = IdentityTabsHeader
IdentityTabs.Tab = IdentityTab

export const useIdentityTabs = useCustomContext(TabsContext)

export default IdentityTabs
