import React from 'react'
import useTranslation from '~/hooks/useTranslation'
import Btn, { BtnTypes } from '../Btn'
import { usePasscode } from './context'
import { IPasscodeComposition } from './types'

const ResetBtn: IPasscodeComposition['ResetBtn'] = ({ onPress }) => {
  const { t } = useTranslation()
  const { setPin } = usePasscode()

  const handlePress = () => {
    setPin('')
    onPress()
  }

  return (
    <Btn type={BtnTypes.secondary} onPress={handlePress}>
      {t('VerifyPasscode.resetBtn')}
    </Btn>
  )
}

export default ResetBtn
