import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { JoloTextSizes } from '~/utils/fonts'
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
      disabled={!onPress}
      onPress={handlePress}
      style={styles.button}
    >
      <JoloText size={JoloTextSizes.mini} customStyles={styles.text}>
        {children}
      </JoloText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  text: {
    textAlign: 'center',
  },
})

export default PasscodeExtraAction
