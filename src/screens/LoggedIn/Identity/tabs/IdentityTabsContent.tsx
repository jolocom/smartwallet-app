import React from 'react'
import { View } from 'react-native'
import { debugView } from '~/utils/dev'

const IdentityTabsContent: React.FC = ({ children }) => {
  return <View style={{ width: '100%' }}>{children}</View>
}

export default IdentityTabsContent
