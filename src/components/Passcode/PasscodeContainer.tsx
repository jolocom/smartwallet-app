import React from 'react'
import { View } from 'react-native'
import { IWithCustomStyle } from '../Card/types'

const PasscodeContainer: React.FC<IWithCustomStyle> = ({
  children,
  customStyles = {},
}) => {
  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          width: '100%',
        },
        customStyles,
      ]}
    >
      {children}
    </View>
  )
}

export default PasscodeContainer
