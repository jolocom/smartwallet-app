import React from 'react'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { Fonts, JoloTextSizes } from '~/utils/fonts'
import JoloText from '../JoloText'
import { ALL_PIN_ATTEMPTS, usePasscode } from './context'

// TODO: add translation
const PasscodeError = () => {
  const { pinAttemptsLeft, pinError } = usePasscode()
  if (!pinError) return null
  const attemptsLeft = ALL_PIN_ATTEMPTS - pinAttemptsLeft + 1 || 1
  return (
    <JoloText
      size={JoloTextSizes.mini}
      color={Colors.error}
      style={{
        lineHeight: BP({ default: 18, xsmall: 14 }),
        fontFamily: Fonts.Regular,
        letterSpacing: 0.09,
      }}
    >{`You have used ${attemptsLeft}/${ALL_PIN_ATTEMPTS} attempts`}</JoloText>
  )
}

export default PasscodeError
