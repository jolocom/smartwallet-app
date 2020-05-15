import React, { useState, useRef } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  NativeSyntheticEvent,
} from 'react-native'

import Paragraph from '~/components/Paragraph'
import { Colors } from '~/utils/colors'

const NUMBER_OF_DIGITS = new Array(4).fill(0)
const CELL_WIDTH = 50

const PasscodeInput = () => {
  const inputRef = useRef<TextInput>(null)
  const [passcode, setPasscode] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const digits = passcode.split('')

  const handlePrress = () => {
    inputRef.current?.focus()
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleChange = (value: string) => {
    setPasscode((prevState) => {
      if (prevState.length >= NUMBER_OF_DIGITS.length) return prevState
      return (prevState + value).slice(0, NUMBER_OF_DIGITS.length)
    })
  }

  const handleUndoKeyPress = (e: NativeSyntheticEvent<TextInput>) => {
    if (e.nativeEvent?.key === 'Backspace') {
      setPasscode((prevState) => prevState.slice(0, prevState.length - 1))
    }
  }

  const activeDigit =
    digits.length < NUMBER_OF_DIGITS.length
      ? digits.length - 1
      : NUMBER_OF_DIGITS.length - 1

  const hideInput = !(passcode.length < NUMBER_OF_DIGITS.length)

  return (
    <TouchableWithoutFeedback onPress={handlePrress}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          value=""
          style={[
            styles.input,
            {
              left: activeDigit * CELL_WIDTH,
              opacity: hideInput ? 0 : 1,
            },
          ]}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleUndoKeyPress}
        />
        {NUMBER_OF_DIGITS.map((digit, idx) => (
          <View key={idx} style={styles.digitBox}>
            <Paragraph color={Colors.white}>{digits[idx] || ''}</Paragraph>
          </View>
        ))}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'orange',
  },
  input: {
    position: 'absolute',
    fontSize: 40,
    textAlign: 'center',
    backgroundColor: 'transparent',
    width: 50,
    top: 0,
    bottom: 0,
  },
  digitBox: {
    width: 50,
    height: 79,
    borderWidth: 2,
    borderColor: Colors.activity,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    fontSize: 40,
  },
})

export default PasscodeInput
