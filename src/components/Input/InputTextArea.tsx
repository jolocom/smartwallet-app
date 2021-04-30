import React, { useEffect, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
// @ts-ignore no typescript support as of yet
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import { strings } from '~/translations'
import BP from '~/utils/breakpoints'
import { ITextAreaInputProps } from './types'
import { CoreInput } from './CoreInput'
import Block from '../Block'
import { Colors } from '~/utils/colors'
import JoloText from '../JoloText'
import { JoloTextSizes } from '~/utils/fonts'

const InputTextArea = React.forwardRef<TextInput, ITextAreaInputProps>(
  (
    { value, updateInput, limit, customStyles = {}, onFocus, ...inputProps },
    ref,
  ) => {
    const [showLimit, setShowLimit] = useState(false)
    const [limitCount, setLimitCount] = useState(0)
    const [limitWarning, setLimitWarning] = useState(false)

    useEffect(() => {
      if (limit) {
        setLimitCount(limit - value.length)
      }

      // NOTE: hide the limit when the user deletes all the values, and show
      // it when they start typing again
      if (value.length === 0) setShowLimit(false)
      else setShowLimit(true)
    }, [value])

    useEffect(() => {
      if (limitCount === 0) {
        ReactNativeHapticFeedback.trigger('impactLight', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: true,
        })
        setLimitWarning(true)
      } else {
        setLimitWarning(false)
      }
    }, [limitCount])

    const handleFocus = () => {
      // NOTE: show the limit when the input is focused
      if (limit && !showLimit) setShowLimit(true)
    }

    return (
      <View style={{ width: '100%' }}>
        {showLimit && (
          <View style={styles.counter}>
            <JoloText
              size={JoloTextSizes.tiniest}
              color={limitWarning ? Colors.error : Colors.white}
            >
              {limitCount}
            </JoloText>
          </View>
        )}
        <Block customStyle={{ padding: 13 }}>
          <CoreInput
            ref={ref}
            placeholder={`${strings.TAP_TO_WRITE}...`}
            value={value}
            maxLength={limit}
            onChangeText={updateInput}
            multiline
            onFocus={handleFocus}
            style={[styles.inputStyle, customStyles]}
            {...inputProps}
          />
        </Block>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  inputStyle: {
    height: BP({ default: 196, small: 150, xsmall: 150 }),
    textAlignVertical: 'top',
  },
  counter: {
    marginTop: -22,
    height: 22,
    width: 60,
    backgroundColor: Colors.black65,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    alignSelf: 'flex-end',
    marginRight: 8,
  },
})

export default InputTextArea
