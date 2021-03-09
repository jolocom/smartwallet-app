import React from 'react'
import { View, LayoutChangeEvent } from 'react-native'

import { useCollapsible } from '../context'

export const HidingTextContainer: React.FC = ({ children }) => {
  const { setDistanceToText } = useCollapsible()

  const handleLayout = (e: LayoutChangeEvent) => {
    setDistanceToText(e.nativeEvent.layout.y)
  }
  return <View onLayout={handleLayout}>{children}</View>
}
