import React from 'react'

import Btn, { BtnTypes } from '~/components/Btn'
import { IPasscodeComposition } from './types'

const PasscodeAccessoryBtn: IPasscodeComposition['AccessoryBtn'] = ({
  title,
  onPress,
}) => {
  return (
    <Btn type={BtnTypes.secondary} onPress={onPress}>
      {title}
    </Btn>
  )
}

export default PasscodeAccessoryBtn
