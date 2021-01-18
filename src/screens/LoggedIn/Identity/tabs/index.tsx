import React, { useMemo, useState } from 'react'

import IdentityTab from './IdentityTab'
import { useCustomContext } from '~/hooks/context'
import IdentityTabsHeader from './IdentityTabsHeader'
import IdentityTabsPage from './IdentityTabsPage'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'

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
    <JoloKeyboardAwareScroll
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'handled'}
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: '40%' }}
    >
      <TabsContext.Provider value={contextValue} children={children} />
    </JoloKeyboardAwareScroll>
  )
}

IdentityTabs.Styled = {
  Header: IdentityTabsHeader,
}
IdentityTabs.Tab = IdentityTab
IdentityTabs.Page = IdentityTabsPage

export const useIdentityTabs = useCustomContext(TabsContext)

export default IdentityTabs
