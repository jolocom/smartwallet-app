import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { Colors } from '~/utils/colors'
import { usePasscode } from './context'
import BP from '~/utils/breakpoints'
import { Fonts } from '~/utils/fonts'

const CELL_ASPECT_RATIO = 0.75

const PasscodeInput: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const { pin, pinError, pinSuccess, passcodeLength: length } = usePasscode()
  const digits = pin.split('')

  const passcodeCells = useMemo(() => new Array(length).fill(0), [length])

  // this will make a delay so it will be possible to see digits and not only asterics
  useEffect(() => {
    let isCurrent = true
    const updateSelectedIndex = async () => {
      // it is implemented with delay to be able to preview digits and not seeing asterics straight away
      setTimeout(() => {
        if (isCurrent) {
          setSelectedIndex(() => {
            if (digits.length < passcodeCells.length) {
              return digits.length
            } else if (digits.length === length) {
              return -1
            } else {
              return passcodeCells.length - 1
            }
          })
        }
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
          {passcodeCells.map((v, index) => {
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
                {isSelected && !digits[index] ? (
                  <View style={styles.caret} />
                ) : (
                  <Text
                    adjustsFontSizeToFit
                    style={styles.text}
                    testID="passcode-cell"
                  >
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
  display: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: BP({ default: 65, xsmall: 56 }),
    flex: 1,
    aspectRatio: CELL_ASPECT_RATIO,
    borderRadius: 11,
    backgroundColor: Colors.black30,
    overflow: 'hidden',
    borderWidth: 2.4,
    borderColor: 'transparent',
    paddingVertical: 12,
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
    fontFamily: Fonts.Regular,
  },
  caret: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.success,
  },
})

export default PasscodeInput
