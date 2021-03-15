export interface ITabsContext {
  activeTab: string | undefined
  setActiveTab: React.Dispatch<React.SetStateAction<string | undefined>>
}

export interface IIdentityTabs {
  initialTab?: string
}

export interface ITabsComposition {
  Tab: React.FC<{ id: string; title: string }>
  Page: React.FC<{ id: string }>
  Styled: {
    Header: React.FC
    Placeholder: React.FC<{ show: boolean }>
  }
}
