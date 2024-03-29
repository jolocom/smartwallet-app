import React, { useMemo, useState } from 'react'
import Panel from './Panel'
import PersistChildren from './PersistChildren'
import Subtab from './Subtab'
import Tab from './Tab'
import { ITabsComposition, ITabs } from './types'
import { TabsContext } from './context'
import { Page } from './Page'

export const Tabs: React.FC<ITabs> & ITabsComposition = ({
  initialActiveTab,
  initialActiveSubtab,
  children,
  tabs,
  subtabs,
}) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab)
  const [activeSubtab, setActiveSubtab] = useState(initialActiveSubtab)

  const contextValue = useMemo(
    () => ({
      activeTab,
      activeSubtab,
      setActiveTab,
      setActiveSubtab,
      tabs,
      subtabs,
    }),
    [activeTab, activeSubtab],
  )

  return <TabsContext.Provider value={contextValue} children={children} />
}

Tabs.Tab = Tab
Tabs.Subtab = Subtab
Tabs.Panel = Panel
Tabs.PersistChildren = PersistChildren
Tabs.Page = Page

export default Tabs
