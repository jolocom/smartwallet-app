import React, { useEffect, useRef, useState } from 'react'
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputKeyPressEventData,
  TouchableWithoutFeedback,
  View,
  TextInput,
} from 'react-native'
import { Colors } from '~/utils/colors'
import { usePasscode } from './context'

const PASSCODE_LENGTH = new Array(4).fill(0)
const DIGIT_CELL_WIDTH = 65
const DIGIT_MARGIN_RIGHT = 7

const PasscodeInput: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const { pin, setPin, pinError, pinSuccess } = usePasscode()
  const digits = pin.split('')

  const inputRef = useRef<TextInput>(null)

  // this will make a delay so it will be possible to see digits and not only asterics
  useEffect(() => {
    let isCurrent = true
    const updateSelectedIndex = async () => {
      // it is implemented with delay to be able to preview digits and not seeing asterics straight away
      setTimeout(() => {
        isCurrent &&
          setSelectedIndex(() => {
            if (digits.length < PASSCODE_LENGTH.length) {
              return digits.length
            } else if (digits.length === 4) {
              return -1
            } else {
              return PASSCODE_LENGTH.length - 1
            }
          })
      }, 100)
    }
    updateSelectedIndex()
    return () => {
      isCurrent = false
    }
  }, [pin])

  const handlePinChange = (val: string) => {
    setPin((prevState: string) => prevState + val)
  }

  const handleRemove = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent?.key === 'Backspace') {
      setPin((prevState: string) => prevState.slice(0, prevState.length - 1))
    }
  }

  const focusInput = () => {
    // NOTE: Workaround for the case when the Keyboard is dismissed with Back-button, and it can't @focus() again
    // https://github.com/facebook/react-native/issues/19366#issuecomment-400603928
    inputRef.current?.blur()
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  return (
    <TouchableWithoutFeedback onPress={focusInput}>
      <View style={styles.inputContainer}>
        <TextInput
          value=""
          ref={inputRef}
          onKeyPress={handleRemove}
          onChangeText={handlePinChange}
          autoFocus
          testID="passcode-digit-input"
          style={[
            styles.input,
            {
              left: selectedIndex * (DIGIT_CELL_WIDTH + DIGIT_MARGIN_RIGHT),
            },
          ]}
          keyboardType="numeric"
          keyboardAppearance="dark"
          selectionColor="transparent"
        />
        <View style={{ flexDirection: 'row' }}>
          {PASSCODE_LENGTH.map((v, index) => {
            const isSelected = digits.length === index
            return (
              <View
                style={[
                  styles.display,
                  isSelected && styles.active,
                  pinError && styles.error,
                  pinSuccess && styles.success,
                ]}
                key={index}
              >
                <Text style={styles.text} testID="passcode-cell">
                  {index === selectedIndex
                    ? digits[index]
                    : index < digits.length
                    ? '*'
                    : ''}
                </Text>
              </View>
            )
          })}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
  },
  input: {
    textAlign: 'center',
    position: 'absolute',
    fontSize: 43,
    backgroundColor: 'transparent',
    width: DIGIT_CELL_WIDTH,
    borderRadius: 11,
    top: 0,
    bottom: 0,
  },
  display: {
    alignItems: 'center',
    justifyContent: 'center',
    width: DIGIT_CELL_WIDTH,
    height: 87,
    borderRadius: 11,
    marginRight: DIGIT_MARGIN_RIGHT,
    backgroundColor: Colors.black,
    overflow: 'visible',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  active: {
    borderColor: Colors.activity,
  },
  error: {
    borderColor: Colors.error,
  },
  success: {
    borderColor: Colors.success,
  },
  text: {
    fontSize: 43,
    color: Colors.white,
  },
})

export default PasscodeInput
