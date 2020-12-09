import React, { useState, useCallback } from 'react'
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Platform,
} from 'react-native'
import { subtitleFontStyles } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { InputValidation, regexValidations } from '~/utils/stringUtils'
import { useJoloAwareScroll } from './JoloKeyboardAwareScroll'

export enum InputValidityState {
  none = 'none',
  error = 'error',
  valid = 'valid',
}

interface Props extends TextInputProps {
  validation?: RegExp
  onValidation?: (state: InputValidityState) => void
}

const FieldInput: React.FC<Props> = ({
  validation = regexValidations[InputValidation.all],
  onChangeText = () => {},
  onValidation = () => {},
  ...inputProps
}) => {
  const [validity, setValidity] = useState(InputValidityState.none)

  const { onFocusInput } = useJoloAwareScroll()

  const getUnderlineColor = useCallback(() => {
    let color: Colors
    switch (validity) {
      case InputValidityState.error:
        color = Colors.error
        break
      case InputValidityState.valid:
        color = Colors.success
        break
      default:
        color = Colors.white60
        break
    }

    return { borderColor: color }
  }, [validity])

  const onChange = (text: string) => {
    const newValidity =
      text.length < 4
        ? InputValidityState.none
        : validation.test(text)
        ? InputValidityState.valid
        : InputValidityState.error

    setValidity(newValidity)

    if (newValidity !== validity) onValidation(newValidity)
    onChangeText(text)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.text, getUnderlineColor()]}
        onChangeText={onChange}
        autoCapitalize={'none'}
        autoCorrect={false}
        returnKeyType={'done'}
        selectionColor={Colors.success}
        underlineColorAndroid={Colors.transparent}
        placeholderTextColor={Colors.white70}
        onFocus={onFocusInput}
        {...inputProps}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    ...subtitleFontStyles.middle,
    color: Colors.white,
    borderBottomWidth: Platform.select({
      android: 1,
      ios: 2,
    }),
    paddingTop: 20,
  },
  container: {
    width: '100%',
  },
})

export default FieldInput
