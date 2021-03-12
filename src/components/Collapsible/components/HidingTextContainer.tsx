import React from 'react'
import { View, LayoutChangeEvent } from 'react-native'

import { useCollapsible } from '../context'
import { ICollapsibleComposite } from '../types'

// TODO: add docs saying that this has to be a child of the scrollview
export const HidingTextContainer: ICollapsibleComposite['HidingTextContainer'] = ({
  children,
  customStyles = {},
}) => {
  const { setDistanceToText, setHidingTextHeight } = useCollapsible()

  const handleLayout = (e: LayoutChangeEvent) => {
    setDistanceToText(e.nativeEvent.layout.y)
    setHidingTextHeight(e.nativeEvent.layout.height)
  }
  return (
    <View style={[customStyles]} onLayout={handleLayout}>
      {children}
    </View>
  )
}
