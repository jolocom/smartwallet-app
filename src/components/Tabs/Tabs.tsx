import React, { useMemo, useState, ReactNode } from 'react'
import { useCustomContext } from '~/hooks/context'
import Panel from './Panel'
import Subtab from './Subtab'
import Tab from './Tab'

interface ITabsContext {
  activeTab: ITabProps | undefined
  activeSubtab: ITabProps | undefined
  setActiveTab: (value: ITabProps) => void
  setActiveSubtab: (value: ITabProps) => void
}

interface ITabProps {
  id: string
  value: string
}

export interface ITab {
  tab: ITabProps
}

//TODO: fix type to accept children which are not functions
type TFunctionalChildren<T> = React.FC<{
  children?: (
    _: T,
  ) => JSX.Element | JSX.Element[] | React.ReactNode | React.ReactNode[]
}>

interface ITabsComposition {
  Tab: React.FC<ITab>
  Subtab: React.FC<ITab>
  Panel: TFunctionalChildren<Pick<ITabsContext, 'activeTab' | 'activeSubtab'>>
}

const TabsContext = React.createContext<ITabsContext | undefined>(undefined)
TabsContext.displayName = 'TabsContext'

interface ITabs {
  initialActiveTab?: ITabProps
  initialActiveSubtab?: ITabProps
}

export const useTabs = useCustomContext(TabsContext)

export const Tabs: React.FC<ITabs> & ITabsComposition = ({
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
