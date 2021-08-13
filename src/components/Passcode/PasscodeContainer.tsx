import React from 'react'
import { View } from 'react-native'
import { IWithCustomStyle } from '~/types/props'

const PasscodeContainer: React.FC<IWithCustomStyle> = ({
  children,
  customStyles = {},
}) => (
  <View
    style={[
      {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        paddingBottom: 40,
      },
      customStyles,
    ]}
  >
    {children}
  </View>
)

export default PasscodeContainer
