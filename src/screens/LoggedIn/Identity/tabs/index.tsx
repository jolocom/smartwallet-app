import React, { useMemo, useState } from 'react'

import IdentityTab from './IdentityTab'
import { useCustomContext } from '~/hooks/context'
import IdentityTabsHeader from './IdentityTabsHeader'
import IdentityTabsPage from './IdentityTabsPage'
import { ScrollView } from 'react-native'
import IdentityTabsPlaceholder from './IdentityTabPlaceholder'

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
  Page: React.FC<{ id: string }>
  Styled: {
    Header: React.FC
    Placeholder: React.FC<{ show: boolean }>
  }
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
      keyboardShouldPersistTaps={'handled'}
      overScrollMode="never"
      style={{ width: '100%' }}
      contentContainerStyle={{ paddingBottom: '40%', paddingTop: 26 }}
    >
      <TabsContext.Provider value={contextValue} children={children} />
    </ScrollView>
  )
}

IdentityTabs.Styled = {
  Header: IdentityTabsHeader,
  Placeholder: IdentityTabsPlaceholder,
}
IdentityTabs.Tab = IdentityTab
IdentityTabs.Page = IdentityTabsPage

export const useIdentityTabs = useCustomContext(TabsContext)

export default IdentityTabs
