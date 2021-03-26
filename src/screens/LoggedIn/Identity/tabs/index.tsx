import React, { useMemo, useState } from 'react'

import IdentityTab from './IdentityTab'
import IdentityTabsHeader from './IdentityTabsHeader'
import IdentityTabsPage from './IdentityTabsPage'
import IdentityTabsPlaceholder from './IdentityTabPlaceholder'
import { IIdentityTabs, ITabsComposition } from './types'
import { IdentityTabsContext } from './context'
import { ScrollView } from 'react-native-gesture-handler'

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
      <IdentityTabsContext.Provider value={contextValue} children={children} />
    </ScrollView>
  )
}

IdentityTabs.Styled = {
  Header: IdentityTabsHeader,
  Placeholder: IdentityTabsPlaceholder,
}
IdentityTabs.Tab = IdentityTab
IdentityTabs.Page = IdentityTabsPage

export default IdentityTabs
