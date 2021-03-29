import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { Colors } from '~/utils/colors'
import { usePasscode } from './context'

const PASSCODE_LENGTH = new Array(4).fill(0)
const DIGIT_CELL_WIDTH = 65
const DIGIT_MARGIN_RIGHT = 7

const PasscodeInput: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const { pin, pinError, pinSuccess } = usePasscode()
  const digits = pin.split('')

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

  return (
    <TouchableWithoutFeedback>
      <View style={styles.inputContainer}>
        <View
          style={{
            flexDirection: 'row',
          }}
        >
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
                {selectedIndex === index && !digits[index] ? (
                  <View style={styles.caret} />
                ) : (
                  <Text style={styles.text} testID="passcode-cell">
                    {index === selectedIndex
                      ? digits[index]
                      : index < digits.length
                      ? '*'
                      : ''}
                  </Text>
                )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    textAlign: 'center',
    fontSize: 43,
    backgroundColor: 'transparent',
    width: DIGIT_CELL_WIDTH,
    borderRadius: 11,
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
    paddingVertical: 14,
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
  caret: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.success,
  },
})

export default PasscodeInput
