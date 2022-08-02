import React, { useEffect, useState } from 'react'
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  View,
} from 'react-native'
// @ts-ignore no typescript support as of yet
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import BP from '~/utils/breakpoints'
import { ITextAreaInputProps } from './types'
import { CoreInput } from './CoreInput'
import Block from '../Block'
import { Colors } from '~/utils/colors'
import JoloText from '../JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import useTranslation from '~/hooks/useTranslation'

const InputTextArea = React.forwardRef<TextInput, ITextAreaInputProps>(
  (
    {
      value,
      updateInput,
      limit,
      customStyles = {},
      onFocus,
      onBlur,
      ...inputProps
    },
    ref,
  ) => {
    const { t } = useTranslation()
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

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      // NOTE: show the limit when the input is focused
      if (limit && !showLimit) setShowLimit(true)
      onFocus && onFocus(e)
    }

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      // NOTE: hide the limit if the input is blured and empty
      if (limit && showLimit && value.length === 0) setShowLimit(false)
      onBlur && onBlur(e)
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
        <Block customStyles={{ padding: 13 }}>
          <CoreInput
            ref={ref}
            placeholder={t('ContactUs.suggestionPlaceholder')}
            value={value}
            maxLength={limit}
            onChangeText={updateInput}
            multiline
            onFocus={handleFocus}
            onBlur={handleBlur}
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
