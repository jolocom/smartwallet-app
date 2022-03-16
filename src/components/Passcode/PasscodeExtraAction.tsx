import React from 'react'
import Btn, { BtnTypes } from '../Btn'
import { usePasscode } from './context'
import { IPasscodeComposition } from './types'

const PasscodeExtraAction: IPasscodeComposition['ExtraAction'] = ({
  onPress,
  title,
}) => {
  const passcodeContext = usePasscode()
  const handlePress = () => {
    onPress && onPress(passcodeContext)
  }
  if (!title) return null
  return (
    <Btn type={BtnTypes.secondary} onPress={handlePress}>
      {title}
    </Btn>
  )
}
export default PasscodeExtraAction
