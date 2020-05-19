import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Text,
} from 'react-native'

import Paragraph from '~/components/Paragraph'
import { Colors } from '~/utils/colors'

const PASSCODE_LENGTH = new Array(4).fill(0)
const DIGIT_WIDTH = 65
const DIGIT_MARGIN_RIGHT = 7

interface PasscodeInputI {
  value: string
  onAdd: (value: string) => void
  onRemove: () => void
  onSubmit: () => void
}

const PasscodeInput: React.FC<PasscodeInputI> = ({
  value,
  onAdd,
  onRemove,
  onSubmit,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<TextInput>(null)

  const digits = value.split('')
  const selectedIndex =
    digits.length < PASSCODE_LENGTH.length
      ? digits.length
      : PASSCODE_LENGTH.length - 1
  const hideInput = !(digits.length < PASSCODE_LENGTH.length)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (value.length === 4) {
      inputRef.current?.blur()

      onSubmit()
    }
  }, [value])

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleRemove = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent?.key === 'Backspace') {
      onRemove()
    }
  }

  return (
    <View style={styles.inputContainer}>
      {PASSCODE_LENGTH.map((v, index) => {
        console.log({ v })
        console.log('digits[index]', digits[index])

        const isSelected = digits.length === index
        return (
          <View
            style={[styles.display, isSelected && isFocused && styles.active]}
            key={index}
          >
            <Text style={styles.text}>{digits[index] || ''}</Text>
          </View>
        )
      })}
      <TextInput
        value=""
        ref={inputRef}
        onChangeText={onAdd}
        onKeyPress={handleRemove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.input,
          {
            left: selectedIndex * (65 + DIGIT_MARGIN_RIGHT),
            opacity: hideInput ? 0 : 1,
          },
        ]}
        keyboardType="numeric"
        keyboardAppearance="dark"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
  },
  input: {
    position: 'absolute',
    fontSize: 43,
    textAlign: 'center',
    backgroundColor: 'transparent',
    width: DIGIT_WIDTH,
    borderRadius: 11,
    top: 0,
    bottom: 0,
  },
  display: {
    width: DIGIT_WIDTH,
    height: 87,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DIGIT_MARGIN_RIGHT,
    backgroundColor: Colors.black,
    overflow: 'visible',
  },
  active: {
    borderWidth: 3,
    borderColor: Colors.activity,
  },
  text: {
    fontSize: 43,
    color: Colors.white,
  },
})

export default PasscodeInput
