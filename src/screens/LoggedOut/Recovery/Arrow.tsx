import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

export enum ArrowDirections {
  left,
  right,
}

const Arrow: React.FC<{ direction?: ArrowDirections; onPress: () => void }> = ({
  children,
  direction = ArrowDirections.left,
  onPress,
}) => {
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
    top: 22,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
})

export default Arrow
