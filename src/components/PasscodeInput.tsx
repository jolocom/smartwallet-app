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
  Text,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native'

import { Colors } from '~/utils/colors'
import useDelay from '~/hooks/useDelay'

const PASSCODE_LENGTH = new Array(4).fill(0)
const DIGIT_CELL_WIDTH = 65
const DIGIT_MARGIN_RIGHT = 7

interface PasscodeInputI {
  value: string
  stateUpdaterFn: Dispatch<SetStateAction<string>>
  onSubmit: () => void
  errorStateUpdaterFn?: Dispatch<SetStateAction<boolean>>
  hasError?: boolean
}

type AddPasscodeFnT = (prevState: string, passcode?: string) => string
type RemovePasscodeFnT = (prevState: string) => string

const PasscodeInput: React.FC<PasscodeInputI> = ({
  value,
  stateUpdaterFn,
  errorStateUpdaterFn,
  onSubmit,
  hasError = false,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<TextInput>(null)

  const digits = value.split('')
  const hideInput = !(digits.length < PASSCODE_LENGTH.length)

  const focusInput = () => {
    inputRef.current?.focus()
  }

  // this will hide keyboard when passcode is complete
  useEffect(() => {
    if (value.length === 4) {
      inputRef.current?.blur()
      onSubmit()
    }
  }, [value])

  // this will remove error once passoce is incompete
  useEffect(() => {
    if (value.length < 4 && hasError && errorStateUpdaterFn) {
      errorStateUpdaterFn(false)
    }
  }, [value])

  // this will make a delay so it will be possible to see digits and not only asterics
  useEffect(() => {
    let isCurrent = true
    const updateSelectedIndex = async () => {
      // it is implemented with delay to be able to preview digits and not seeing asterics straight away
      await useDelay(() => {
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
  }, [value])

  const handleFocus = () => {
    setIsFocused(true)
    if (hasError && errorStateUpdaterFn) {
      errorStateUpdaterFn(false)
      stateUpdaterFn('')
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  // a callback function that is passed (when we changing passcode) to setPasscode or setVerifiedPasscode
  const addToPasscodeCb: AddPasscodeFnT = (prevState, passcode) => {
    if (prevState.length >= PASSCODE_LENGTH.length) return prevState
    return (prevState + passcode).slice(0, PASSCODE_LENGTH.length)
  }

  // the first parameter is a setter function of passcode or verifiedPasscode, the second is deciding to add or to remove from/to passcode
  const updatePasscode = (
    passcodeManipulationFn: AddPasscodeFnT | RemovePasscodeFnT,
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

  const handleAddingToPasscode = addToPasscode(stateUpdaterFn)

  return (
    <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
      <TouchableWithoutFeedback onPress={focusInput}>
        <View style={styles.inputContainer}>
          <TextInput
            value=""
            ref={inputRef}
            onChangeText={handleAddingToPasscode}
            onFocus={handleFocus}
            autoFocus={true}
            onBlur={handleBlur}
            testID="passcode-digit-input"
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
    </ScrollView>
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
