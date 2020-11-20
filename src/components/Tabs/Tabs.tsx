import React, { useContext, useMemo, useState } from 'react'
import Panel from './Panel'
import Subtab from './Subtab'
import Tab from './Tab'

interface ITabsContext {
  activeTab: string | undefined
  activeSubtab: string | undefined
  setActiveTab: (value: string) => void
  setActiveSubtab: (value: string) => void
}

export interface ITabProps {
  children: string
}

interface ITabsComposition {
  Tab: React.FC<ITabProps>
  Subtab: React.FC<ITabProps>
  Panel: React.FC
}

const TabsContext = React.createContext<ITabsContext | undefined>(undefined)

interface ITabs {
  initialActiveTab?: string
  initialActiveSubtab?: string
}

export const useTabs = () => {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Component should be wrapped with Tabs')
  return context
}

const Tabs: React.FC<ITabs> & ITabsComposition = ({
  initialActiveTab,
  initialActiveSubtab,
  children,
}) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab)
  const [activeSubtab, setActiveSubtab] = useState(initialActiveSubtab)

  const contextValue = useMemo(
    () => ({
      activeTab,
      activeSubtab,
      setActiveTab,
      setActiveSubtab,
    }),
    [activeTab, activeSubtab],
  )

  return <TabsContext.Provider value={contextValue} children={children} />
}

Tabs.Tab = Tab
Tabs.Subtab = Subtab
Tabs.Panel = Panel

export default Tabs
