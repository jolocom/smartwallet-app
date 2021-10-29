import React from 'react'

import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import useTranslation from '~/hooks/useTranslation'
import PasscodeAccessoryBtn from './PasscodeAccessoryBtn'

const PasscodeForgot = () => {
  const { t } = useTranslation()
  const redirectToPinRecoveryInstruction = useRedirectTo(
    ScreenNames.PinRecoveryInstructions,
  )

  return (
    <PasscodeAccessoryBtn
      title={t('Lock.forgotBtn')}
      onPress={redirectToPinRecoveryInstruction}
    />
  )
}

export default PasscodeForgot
