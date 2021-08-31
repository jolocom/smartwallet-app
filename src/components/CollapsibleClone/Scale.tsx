import React from 'react'
import { useCallback } from 'react'
import { Animated } from 'react-native'
import { useCollapsibleClone } from './context'
import { ICollapsibleCloneComposite } from './types'

const Scale: ICollapsibleCloneComposite['Scale'] = ({ children }) => {
  const { scrollY, currentTitle } = useCollapsibleClone()

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
