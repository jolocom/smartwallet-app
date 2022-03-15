import React from 'react'
import { TouchableOpacity } from 'react-native'
import { debugView } from '~/utils/dev'
import { JoloTextSizes } from '~/utils/fonts'
import Btn, { BtnTypes } from '../Btn'
import JoloText from '../JoloText'
import { usePasscode } from './context'
import { IPasscodeComposition } from './types'

const PasscodeExtraAction: IPasscodeComposition['ExtraAction'] = ({
  onPress,
  children,
}) => {
  const passcodeContext = usePasscode()
  const handlePress = () => {
    onPress && onPress(passcodeContext)
  }
  if (!children) return null
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ paddingHorizontal: 40, marginBottom: 24 }}
    >
      <JoloText
        size={JoloTextSizes.mini}
        customStyles={{ textAlign: 'center' }}
      >
        {children}
      </JoloText>
    </TouchableOpacity>
  )
}
export default PasscodeExtraAction
