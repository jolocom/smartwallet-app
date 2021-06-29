import React from 'react'
import { Animated } from 'react-native'
import { useCollapsibleClone } from './context'
import { ICollapsibleCloneComposite } from './types'

const Scale: ICollapsibleCloneComposite['Scale'] = ({ children }) => {
  const { scrollY, currentTitle, headerHeight } = useCollapsibleClone()

  const scale = scrollY.interpolate({
    inputRange: [0, currentTitle?.startY ? currentTitle.startY : headerHeight],
    outputRange: [1, 0],
  })

  return (
    <Animated.View style={[{ transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  )
}

export default Scale
