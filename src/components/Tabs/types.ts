export interface ITabsContext {
  activeTab: ITabProps | undefined
  activeSubtab: ITabProps | undefined
  setActiveTab: (value: ITabProps) => void
  setActiveSubtab: (value: ITabProps) => void
}

export interface ITabProps {
  id: string
  value: string
}

export interface ITab {
  tab: ITabProps
}

export interface ITabPersistChildren {
  isContentVisible: boolean
}

//TODO: fix type to accept children which are not functions
export type TFunctionalChildren<T> = React.FC<{
  children?: (
    _: T,
  ) => JSX.Element | JSX.Element[] | React.ReactNode | React.ReactNode[]
}>

export interface ITabsComposition {
  Tab: React.FC<ITab>
  Subtab: React.FC<ITab>
  Panel: TFunctionalChildren<Pick<ITabsContext, 'activeTab' | 'activeSubtab'>>
  PersistChildren: React.FC<ITabPersistChildren>
}

export interface ITabs {
  initialActiveTab?: ITabProps
  initialActiveSubtab?: ITabProps
}
