import React from 'react'
import useTranslation from '~/hooks/useTranslation'
import { usePasscode } from './context'
import PasscodeAccessoryBtn from './PasscodeAccessoryBtn'
import { IPasscodeComposition } from './types'

const ResetBtn: IPasscodeComposition['ResetBtn'] = ({ onPress }) => {
  const { t } = useTranslation()
  const { setPin } = usePasscode()

  const handlePress = () => {
    setPin('')
    onPress()
  }

  return (
    <PasscodeAccessoryBtn
      title={t('VerifyPasscode.resetBtn')}
      onPress={handlePress}
    />
  )
}

export default ResetBtn
