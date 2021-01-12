import React from 'react'
import { useKeyboard } from '@react-native-community/hooks'

import { strings } from '~/translations'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import Btn, { BtnTypes } from '~/components/Btn'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'

const PasscodeForgot = () => {
  const { keyboardHeight } = useKeyboard()
  const redirectToPinRecoveryInstruction = useRedirectTo(
    ScreenNames.PinRecoveryInstructions,
  )

  return (
    <AbsoluteBottom customStyles={{ bottom: keyboardHeight }}>
      <Btn type={BtnTypes.secondary} onPress={redirectToPinRecoveryInstruction}>
        {strings.FORGOT_YOUR_PIN}
      </Btn>
    </AbsoluteBottom>
  )
}

export default PasscodeForgot
