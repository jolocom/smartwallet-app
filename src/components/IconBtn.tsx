import React from 'react'
import { IWithCustomStyle } from '~/types/props'
import {
  TouchableOpacityProps,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

interface Props extends TouchableOpacityProps, IWithCustomStyle {
  onPress: () => void
}

const IconBtn: React.FC<Props> = ({
  customStyles,
  onPress,
  children,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, customStyles]}
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
