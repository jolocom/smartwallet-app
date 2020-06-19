import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

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
    top: 30,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
})

export default Arrow
