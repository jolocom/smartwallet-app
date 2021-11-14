import React from 'react'
import { View } from 'react-native'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { Fonts, JoloTextSizes } from '~/utils/fonts'
import JoloText from '../JoloText'
import { usePasscode } from './context'

const PasscodeError = () => {
  const { pinErrorText } = usePasscode()
  return (
    <JoloText
      size={JoloTextSizes.mini}
      color={Colors.error}
      style={{
        lineHeight: BP({ default: 18, xsmall: 14 }),
        fontFamily: Fonts.Regular,
        letterSpacing: 0.09,
      }}
    >
      {pinErrorText}
    </JoloText>
  )
}

export default PasscodeError
