import React from 'react'
import { View } from 'react-native'
import { useTabs } from './context'
import { ITabsComposition } from './types'

// TODO: only takes the Tabs into consideration. Doesn't handle subtabs yet.
export const Page: ITabsComposition['Page'] = ({
  children,
  id,
  customStyles = {},
}) => {
  const { activeTab, activeSubtab } = useTabs()
  const isActive = id === activeTab?.id || id === activeSubtab?.id

  return (
    <View
      style={[
        {
          display: isActive ? 'flex' : 'none',
          paddingHorizontal: '5%',
        },
        customStyles,
      ]}
    >
      {children}
    </View>
  )
}
