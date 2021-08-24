import React from 'react'
import { View } from 'react-native'
import useTranslation from '~/hooks/useTranslation'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { Fonts, JoloTextSizes } from '~/utils/fonts'
import JoloText from '../JoloText'
import { ALL_PIN_ATTEMPTS, usePasscode } from './context'

const PasscodeError = () => {
  const { t } = useTranslation()
  const { pinAttemptsLeft, pinError } = usePasscode()
  if (!pinError) return null
  const attemptsLeft = ALL_PIN_ATTEMPTS - pinAttemptsLeft + 1 || 1

  return (
    <View style={{ position: 'absolute', top: 20 }}>
      <JoloText
        size={JoloTextSizes.mini}
        color={Colors.error}
        style={{
          lineHeight: BP({ default: 18, xsmall: 14 }),
          fontFamily: Fonts.Regular,
          letterSpacing: 0.09,
        }}
      >
        {t('Lock.errorMsg', {
          attempts: `${attemptsLeft}/${ALL_PIN_ATTEMPTS}`,
          escapeValue: false,
        })}
      </JoloText>
    </View>
  )
}

export default PasscodeError
