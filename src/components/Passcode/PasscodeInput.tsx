import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { Colors } from '~/utils/colors'
import { usePasscode } from './context'
import BP from '~/utils/breakpoints'
import { Fonts } from '~/utils/fonts'
import { IPasscodeComposition } from './types'

const CELL_ASPECT_RATIO = 0.75

const PasscodeCell: React.FC<{
  selected: boolean
  success: boolean
  error: boolean
  color: Colors
  value: string | undefined
  showValue: boolean
  showAsterix: boolean
}> = ({ selected, success, error, color, value, showValue, showAsterix }) => {
  return (
    <View
      style={[
        styles.display,
        selected && styles.active,
        error && styles.error,
        success && styles.success,
        {
          backgroundColor: color,
          maxWidth: BP({ default: 65, xsmall: 56 }),
        },
      ]}
    >
      {selected && !value ? (
        <View style={styles.caret} />
      ) : (
        <Text adjustsFontSizeToFit style={styles.text} testID="passcode-cell">
          {showValue ? value : showAsterix ? '*' : ''}
        </Text>
      )}
    </View>
  )
}

const PasscodeInput: IPasscodeComposition['Input'] = ({
  cellColor = Colors.black30,
  numberOfLines = 1,
}) => {
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
    <View>
      {Array.from(Array(numberOfLines)).map((_, line) => {
        const baseIndex = (length / numberOfLines) * line
        const nextBaseIndex = (length / numberOfLines) * (line + 1)
        return (
          <View
            style={[
              styles.inputContainer,
              {
                ...(line !== 0 && {
                  marginTop: 12,
                }),
              },
            ]}
          >
            {passcodeCells.map((_, index) => {
              const isSelected = digits.length === index
              return index >= baseIndex && index < nextBaseIndex ? (
                <PasscodeCell
                  error={pinError}
                  success={pinSuccess}
                  selected={isSelected}
                  value={digits[index]}
                  showValue={index === selectedIndex}
                  showAsterix={index < digits.length}
                  color={cellColor}
                />
              ) : null
            })}
          </View>
        )
      })}
    </View>
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
    marginHorizontal: 2,
    marginVertical: 2,
    flex: 1,
    aspectRatio: CELL_ASPECT_RATIO,
    borderRadius: 11,
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
