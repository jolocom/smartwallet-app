import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { usePasscode } from './context'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '../JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import {
  BackArrowIcon,
  FaceIdIcon,
  FingerprintIcon,
  KeyboardEraseIcon,
} from '~/assets/svg'
import BP from '~/utils/breakpoints'
import { IPasscodeKeyboardProps } from './types'
import { BiometryTypes } from '~/screens/Modals/DeviceAuthentication/module/deviceAuthTypes'

interface NumberButtonProps {
  value: number
  onPress: (value: number) => void
}

const NumberButton: React.FC<NumberButtonProps> = ({ value, onPress }) => (
  <TouchableOpacity
    testID={`keyboard-button-${value}`}
    onPress={() => onPress(value)}
    style={styles.button}
  >
    <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
      {value}
    </JoloText>
  </TouchableOpacity>
)

interface CustomButtonProps {
  onPress?: () => void
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onPress = () => undefined,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, { backgroundColor: Colors.transparent }]}
  >
    {children}
  </TouchableOpacity>
)

const KeyboardRow: React.FC = ({ children }) => (
  <View style={styles.row}>{children}</View>
)

const PasscodeKeyboard: React.FC<IPasscodeKeyboardProps> = ({
  biometryType,
  onBiometryPress,
}) => {
  const { pin, setPin } = usePasscode()

  const handleNumberPress = (value: number) => {
    setPin(`${pin}${value}`)
  }

  const handleDeleteNumber = () => {
    setPin(pin.slice(0, -1))
  }

  const renderBiometryIcon = () => {
    switch (biometryType) {
      case BiometryTypes.FaceID:
        return <FaceIdIcon />
      case BiometryTypes.Biometrics:
      case BiometryTypes.TouchID:
        return <FingerprintIcon />
      default:
        return null
    }
  }

  return (
    <View testID="passcode-keyboard" style={styles.container}>
      <KeyboardRow>
        <NumberButton value={1} onPress={handleNumberPress} />
        <NumberButton value={2} onPress={handleNumberPress} />
        <NumberButton value={3} onPress={handleNumberPress} />
      </KeyboardRow>
      <KeyboardRow>
        <NumberButton value={4} onPress={handleNumberPress} />
        <NumberButton value={5} onPress={handleNumberPress} />
        <NumberButton value={6} onPress={handleNumberPress} />
      </KeyboardRow>
      <KeyboardRow>
        <NumberButton value={7} onPress={handleNumberPress} />
        <NumberButton value={8} onPress={handleNumberPress} />
        <NumberButton value={9} onPress={handleNumberPress} />
      </KeyboardRow>
      <KeyboardRow>
        <CustomButton onPress={onBiometryPress}>
          <View style={styles.biometryContainer}>{renderBiometryIcon()}</View>
        </CustomButton>
        <NumberButton value={0} onPress={handleNumberPress} />
        <CustomButton onPress={handleDeleteNumber}>
          <KeyboardEraseIcon />
        </CustomButton>
      </KeyboardRow>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  button: {
    height: BP({ default: 56, xsmall: 48 }),
    backgroundColor: Colors.black50,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 3,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 2,
  },
  biometryContainer: {
    padding: 12,
    width: '100%',
    height: '100%',
  },
})

export default PasscodeKeyboard
