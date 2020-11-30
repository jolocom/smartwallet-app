import React from 'react'
import { View } from 'react-native'

const Panel: React.FC = ({ children }) => {
  return <View style={{ flex: 1, width: '100%' }}>{children}</View>
}

export default Panel
