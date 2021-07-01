import React from 'react'
import { TouchableOpacityProps } from 'react-native'
import { StyleSheet, ViewStyle, TouchableOpacity } from 'react-native'

interface Props extends TouchableOpacityProps {
  onPress: () => void
  style?: ViewStyle
}

const IconBtn: React.FC<Props> = ({ style, onPress, children, ...props }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      {...props}
    >
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default IconBtn
