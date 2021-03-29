import React from 'react'
import { View } from 'react-native'

const PasscodeContainer: React.FC = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {children}
    </View>
  )
}

export default PasscodeContainer
