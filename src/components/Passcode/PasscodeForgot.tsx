import React from 'react'

import { strings } from '~/translations'
import Btn, { BtnTypes } from '~/components/Btn'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'

const PasscodeForgot = () => {
  const redirectToPinRecoveryInstruction = useRedirectTo(
    ScreenNames.PinRecoveryInstructions,
  )

  return (
    <Btn type={BtnTypes.secondary} onPress={redirectToPinRecoveryInstruction}>
      {strings.FORGOT_YOUR_PASSCODE}
    </Btn>
  )
}

export default PasscodeForgot
