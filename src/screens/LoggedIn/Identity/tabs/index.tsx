import React, { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'

import IdentityTab from './IdentityTab'
import { useCustomContext } from '~/hooks/context'
import IdentityTabsHeader from './IdentityTabsHeader'
import IdentityTabsPage from './IdentityTabsPage'

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
  Tab: React.FC<{ id: string; title: string }>
  Styled: {
    Header: React.FC
  }
  Page: React.FC<{ id: string }>
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

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: '40%' }}
    >
      <TabsContext.Provider value={contextValue} children={children} />
    </ScrollView>
  )
}

IdentityTabs.Styled.Header = IdentityTabsHeader
IdentityTabs.Tab = IdentityTab
IdentityTabs.Page = IdentityTabsPage

export const useIdentityTabs = useCustomContext(TabsContext)

export default IdentityTabs
