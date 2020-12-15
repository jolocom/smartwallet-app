import React, { useCallback, useState } from 'react'
import { Platform, StyleSheet, TextInput } from 'react-native'

import { Colors } from '~/utils/colors'
import { InputValidation, regexValidations } from '~/utils/stringUtils'
import { CoreInput, IInput } from '.'

export enum InputValidityState {
  none = 'none',
  error = 'error',
  valid = 'valid',
}

interface IInputUnderline extends IInput {
  validation?: RegExp
  onValidation?: (state: InputValidityState) => void
}

const InputUnderline: React.FC<IInputUnderline> = React.forwardRef<
  TextInput,
  IInputUnderline
>(
  (
    {
      value,
      validation = regexValidations[InputValidation.all],
      updateInput,
      onValidation = () => {},
      ...inputProps
    },
    ref,
  ) => {
    const [validity, setValidity] = useState(InputValidityState.none)

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
      updateInput(text)
    }

    return (
      <CoreInput
        ref={ref}
        style={[styles.text, getUnderlineColor()]}
        onChangeText={onChange}
        autoCapitalize={'none'}
        autoCorrect={false}
        returnKeyType={'done'}
        selectionColor={Colors.success}
        underlineColorAndroid={Colors.transparent}
        value={value}
        {...inputProps}
      />
    )
  },
)

const styles = StyleSheet.create({
  text: {
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

export default InputUnderline
