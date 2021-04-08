import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { usePasscode } from './context'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '../JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { BackArrowIcon } from '~/assets/svg'
import BP from '~/utils/breakpoints'

interface NumberButtonProps {
  value: number
  onPress: (value: number) => void
}

const NumberButton: React.FC<NumberButtonProps> = ({ value, onPress }) => {
  return (
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
}

interface CustomButtonProps {
  onPress?: () => void
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onPress = () => {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: Colors.transparent }]}
    >
      {children}
    </TouchableOpacity>
  )
}

const KeyboardRow: React.FC = ({ children }) => {
  return <View style={styles.row}>{children}</View>
}

const PasscodeKeyboard = () => {
  const { pin, setPin } = usePasscode()

  const handleNumberPress = (value: number) => {
    setPin(`${pin}${value}`)
  }

  const handleDeleteNumber = () => {
    setPin(pin.slice(0, -1))
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
        <CustomButton />
        <NumberButton value={0} onPress={handleNumberPress} />
        <CustomButton onPress={handleDeleteNumber}>
          {/* FIXME: add the real icon */}
          <BackArrowIcon />
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
})

export default PasscodeKeyboard
