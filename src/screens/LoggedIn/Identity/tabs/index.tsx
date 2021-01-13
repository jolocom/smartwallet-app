import React, { useMemo, useState } from 'react'

import IdentityTab, { IdentityTabType } from './IdentityTab'
import { useCustomContext } from '~/hooks/context'
import IdentityTabsHeader from './IdentityTabsHeader'
import IdentityTabsContent from './IdentityTabsContent'
import IdentityTabsPage from './IdentityTabsPage'
import { ScrollView } from 'react-native'

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
  Content: React.FC
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

IdentityTabs.Header = IdentityTabsHeader
IdentityTabs.Tab = IdentityTab
IdentityTabs.Content = IdentityTabsContent
IdentityTabs.Page = IdentityTabsPage

export const useIdentityTabs = useCustomContext(TabsContext)

export default IdentityTabs
