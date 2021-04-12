import React from 'react'
import { View } from 'react-native'
import { useIdentityTabs } from './context'
import { ITabsComposition } from './types'

const IdentityTabsPage: ITabsComposition['Page'] = ({
  id,
  children,
  customStyles = {},
}) => {
  const { activeTab } = useIdentityTabs()
  const isActive = id === activeTab

  return (
    <View
      style={[
        { display: isActive ? 'flex' : 'none', paddingHorizontal: '5%' },
        customStyles,
      ]}
    >
      {children}
    </View>
  )
}

export default IdentityTabsPage
