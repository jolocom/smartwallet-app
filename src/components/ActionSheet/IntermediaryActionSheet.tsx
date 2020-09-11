import React, { useRef, useEffect, useState } from 'react'
import {
  TextInput,
  Alert,
  StyleSheet,
  View,
  Keyboard,
  Platform,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setIntermediaryState } from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'
import { getAttributeInputKey } from '~/modules/interaction/selectors'
import BasWrapper from './BasWrapper'
import { useCreateAttributes } from '~/hooks/attributes'
import { ATTR_KEYBOARD_TYPE } from '~/types/credentials'
import { useLoader } from '~/hooks/useLoader'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'

const IntermediaryActionSheet = () => {
  const dispatch = useDispatch()
  const loader = useLoader()
  const inputType = useSelector(getAttributeInputKey)
  const inputRef = useRef<TextInput>(null)
  const createAttribute = useCreateAttributes()
  const [value, setValue] = useState('')
  const keyboardType = inputType ? ATTR_KEYBOARD_TYPE[inputType] : 'default'

  const focusKeyboard = () => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 600)
  }

  useEffect(() => {
    focusKeyboard()
  }, [])

  const handleSubmit = async () => {
    if (!inputType) throw new Error('No attribute provided')

    if (value.length) {
      const success = await loader(
        async () => {
          await createAttribute(inputType, value)
          dispatch(setIntermediaryState(IntermediaryState.hiding))
        },
        { showSuccess: false },
      )

      if (!success) {
        dispatch(setIntermediaryState(IntermediaryState.hiding))
        //TODO: add notification
        Alert.alert('Failed to create a new attribute')
      }
    } else {
      focusKeyboard()
      //TODO: add notification when input is empty
    }
  }

  return (
    <BasWrapper withFooter={false} customStyle={{ paddingTop: 32 }}>
      <View style={styles.inputWrapper}>
        <TextInput
          keyboardType={keyboardType}
          autoCapitalize={'none'}
          autoCorrect={false}
          onSubmitEditing={handleSubmit}
          ref={inputRef}
          selectionColor={Colors.success}
          value={value}
          onChangeText={setValue}
          style={styles.inputText}
        />
      </View>
    </BasWrapper>
  )
}

const styles = StyleSheet.create({
  inputWrapper: {
    paddingHorizontal: 20,
    height: 50,
    backgroundColor: Colors.black,
    borderRadius: 8,
  },
  inputText: {
    color: Colors.white,
    fontFamily: Fonts.Regular,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0.14,
  },
})

export default IntermediaryActionSheet
