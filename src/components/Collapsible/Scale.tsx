import React from 'react'
import { useCallback } from 'react'
import { Animated } from 'react-native'
import { useCollapsible } from './context'
import { ICollapsibleComposite } from './types'

const Scale: ICollapsibleComposite['Scale'] = ({ children }) => {
  const { scrollY, currentTitle } = useCollapsible()

  const getScale = useCallback(() => {
    if (currentTitle === undefined) return 1
    return scrollY.interpolate({
      inputRange: [0, currentTitle.startY],
      outputRange: [1, 0.2],
      extrapolate: 'clamp',
    })
  }, [JSON.stringify(currentTitle)])
  const getTranslateY = useCallback(() => {
    if (currentTitle === undefined) return 1
    return scrollY.interpolate({
      inputRange: [0, currentTitle.startY],
      outputRange: [0, 20],
      extrapolate: 'clamp',
    })
  }, [JSON.stringify(currentTitle)])

  return (
    <Animated.View
      style={[
        { transform: [{ scale: getScale() }, { translateY: getTranslateY() }] },
      ]}
    >
      {children}
    </Animated.View>
  )
}

export default Scale
