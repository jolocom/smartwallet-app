import React from 'react'
import { StyleSheet, ViewStyle, TouchableOpacity } from 'react-native'

interface Props {
  onPress: () => void
  style?: ViewStyle
}

const IconBtn: React.FC<Props> = ({ style, onPress, children }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
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
