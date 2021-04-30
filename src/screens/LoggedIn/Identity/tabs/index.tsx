import React, { useMemo, useState, useEffect } from 'react'

import IdentityTab from './IdentityTab'
import IdentityTabsHeader from './IdentityTabsHeader'
import IdentityTabsPage from './IdentityTabsPage'
import IdentityTabsPlaceholder from './IdentityTabPlaceholder'
import { IIdentityTabs, ITabsComposition } from './types'
import { IdentityTabsContext } from './context'
import { ScrollView } from 'react-native-gesture-handler'
import BP from '~/utils/breakpoints'

const IdentityTabs: React.FC<IIdentityTabs> & ITabsComposition = ({
  initialTab,
  children,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    if (activeTab !== initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

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
      contentContainerStyle={{
        paddingBottom: '40%',
        paddingTop: BP({ default: 8, xsmall: 4 }),
      }}
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
