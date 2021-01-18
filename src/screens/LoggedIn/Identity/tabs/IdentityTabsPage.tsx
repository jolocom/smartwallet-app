import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useIdentityTabs } from '.'

interface Props {
  id: string
}

const IdentityTabsPage: React.FC<Props> = ({ id, children }) => {
  const { activeTab } = useIdentityTabs()
  const isActive = id === activeTab

  return <View style={{ display: isActive ? 'flex' : 'none' }}>{children}</View>
}

export default IdentityTabsPage
