import React, { useCallback, useState } from 'react'
import { Platform, StyleSheet, TextInput } from 'react-native'

import { Colors } from '~/utils/colors'
import { InputValidation, regexValidations } from '~/utils/stringUtils'
import { IInputUnderline, InputValidityState } from './types'
import { CoreInput } from './CoreInput'

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
        text.length < 1
          ? InputValidityState.none
          : text.match(validation)
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
