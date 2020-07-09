import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

import BP from '~/utils/breakpoints'

export enum ArrowDirections {
  left,
  right,
}

interface ArrowPropsI {
  direction: ArrowDirections
  onPress: () => void
}

const Arrow: React.FC<ArrowPropsI> = ({ children, direction, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.arrows,
        direction === ArrowDirections.left
          ? styles.leftArrow
          : styles.rightArrow,
      ]}
    >
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  arrows: {
    position: 'absolute',
    top: BP({
      small: 0,
      medium: 13,
      large: 13,
    }),
    padding: 15,
  },
  leftArrow: {
    left: 0,
  },
  rightArrow: {
    right: 0,
  },
})

export default Arrow
