import React from 'react'
import { View, ViewStyle } from 'react-native'

interface Props {
  customStyles?: ViewStyle
}

const PasscodeWrapper: React.FC<Props> = ({ children, customStyles = {} }) => {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: '35%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        ...customStyles,
      }}>
      {children}
    </View>
  )
}

export default PasscodeWrapper
