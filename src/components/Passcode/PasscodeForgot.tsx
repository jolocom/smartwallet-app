import React from 'react'

import Btn, { BtnTypes } from '~/components/Btn'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import useTranslation from '~/hooks/useTranslation'

const PasscodeForgot = () => {
  const { t } = useTranslation()
  const redirectToPinRecoveryInstruction = useRedirectTo(
    ScreenNames.PinRecoveryInstructions,
  )

  return (
    <Btn type={BtnTypes.secondary} onPress={redirectToPinRecoveryInstruction}>
      {t('Lock.forgotBtn')}
    </Btn>
  )
}

export default PasscodeForgot
