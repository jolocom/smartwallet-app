import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import CloseIcon from '~/assets/svg/CloseIcon'
import { TouchableOpacity } from 'react-native-gesture-handler'
import useNavigateBack from '~/hooks/useNavigateBack'

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
