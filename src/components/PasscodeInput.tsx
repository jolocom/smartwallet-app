import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'

import { Colors } from '~/utils/colors'

const PASSCODE_LENGTH = new Array(4).fill(0)
const DIGIT_CELL_WIDTH = 65
const DIGIT_MARGIN_RIGHT = 7

interface PasscodeInputI {
  value: string
  stateUpdaterFn: Dispatch<SetStateAction<string>>
  onSubmit: () => void
  hasError?: boolean
}

type addPasscodeFnT = (prevState: string, passcode?: string) => string
type removePasscodeFnT = (prevState: string) => string

const PasscodeInput: React.FC<PasscodeInputI> = ({
  value,
  stateUpdaterFn,
  onSubmit,
  hasError = false,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<TextInput>(null)

  const digits = value.split('')
  const selectedIndex =
    digits.length < PASSCODE_LENGTH.length
      ? digits.length
      : PASSCODE_LENGTH.length - 1
  const hideInput = !(digits.length < PASSCODE_LENGTH.length)

  const handlePress = () => {
    inputRef.current?.focus()
  }

  // focus on mount
  useEffect(handlePress, [])

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
      handleRemovingFromPasscode()
    }
  }

  // a callback function that is passed (when we changing passcode) to setPasscode or setVerifiedPasscode
  const addToPasscodeCb: addPasscodeFnT = (prevState, passcode) => {
    if (prevState.length >= PASSCODE_LENGTH.length) return prevState
    return (prevState + passcode).slice(0, PASSCODE_LENGTH.length)
  }

  // a callback function that is passed (when we removing digits from passcode) to setPasscode or setVerifiedPasscode
  const removeFromPasscodeCb: removePasscodeFnT = (prevState) =>
    prevState.slice(0, prevState.length - 1)

  // the first parameter is a setter function of passcode or verifiedPasscode, the second is deciding to add or to remove from/to passcode
  const updatePasscode = (
    passcodeManipulationFn: addPasscodeFnT | removePasscodeFnT,
  ) => {
    return (passcodeUpdaterFn: Dispatch<SetStateAction<string>>) => {
      return (passcode?: string) => {
        passcodeUpdaterFn((prevState: string) =>
          passcodeManipulationFn(prevState, passcode),
        )
      }
    }
  }

  const addToPasscode = updatePasscode(addToPasscodeCb)
  const removeFromPasscode = updatePasscode(removeFromPasscodeCb)

  // const handleAddingToPasscode = addToPasscode(setPasscode);
  const handleAddingToPasscode = addToPasscode(stateUpdaterFn)
  const handleRemovingFromPasscode = removeFromPasscode(stateUpdaterFn)

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.inputContainer}>
        <View style={{ flexDirection: 'row' }}>
          {PASSCODE_LENGTH.map((v, index) => {
            const isSelected = digits.length === index
            return (
              <View
                style={[
                  styles.display,
                  isSelected && isFocused && styles.active,
                  hasError && styles.error,
                ]}
                key={index}
              >
                {/* <Text style={styles.text}>{digits[index] || ''}</Text> */}
                <Text style={styles.text}>
                  {(index < digits.length && '*') || ''}
                </Text>
              </View>
            )
          })}
        </View>
        <TextInput
          value=""
          ref={inputRef}
          onChangeText={handleAddingToPasscode}
          onKeyPress={handleRemove}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            {
              left: selectedIndex * (DIGIT_CELL_WIDTH + DIGIT_MARGIN_RIGHT),
              opacity: hideInput ? 0 : 1,
            },
          ]}
          keyboardType="numeric"
          keyboardAppearance="dark"
          selectionColor="transparent"
        />
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
  text: {
    fontSize: 43,
    color: Colors.white,
  },
})

export default PasscodeInput
