import React, { useRef, useEffect, useState } from 'react'
import { TextInput, Alert, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setIntermediaryState } from '~/modules/interaction/actions'
import { IntermediarySheetState } from '~/modules/interaction/types'
import {
  getAttributeInputKey,
  getInteractionCounterparty,
} from '~/modules/interaction/selectors'
import BasWrapper from './BasWrapper'
import { useCreateAttributes } from '~/hooks/attributes'
import { ATTR_KEYBOARD_TYPE, ATTR_UI_NAMES } from '~/types/credentials'
import { useLoader } from '~/hooks/useLoader'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'
import { strings } from '~/translations/strings'
import truncateDid from '~/utils/truncateDid'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'

const IntermediarySheetBody = () => {
  const dispatch = useDispatch()
  const loader = useLoader()
  const inputType = useSelector(getAttributeInputKey)
  const counterparty = useSelector(getInteractionCounterparty)
  const title = strings.ADD_YOUR_ATTRIBUTE(ATTR_UI_NAMES[inputType])
  const description = strings.THIS_PUBLIC_PROFILE_CHOSE_TO_REMAIN_ANONYMOUS(
    truncateDid(counterparty.did),
  )
  const keyboardType = ATTR_KEYBOARD_TYPE[inputType]
  const inputRef = useRef<TextInput>(null)
  const createAttribute = useCreateAttributes()
  const [value, setValue] = useState('')

  const focusKeyboard = () => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 600)
  }

  useEffect(() => {
    focusKeyboard()
  }, [])

  const handleSubmit = async () => {
    if (value.length) {
      const success = await loader(
        async () => {
          await createAttribute(inputType, value)
          dispatch(setIntermediaryState(IntermediarySheetState.switching))
        },
        { showSuccess: false },
      )

      if (!success) {
        dispatch(setIntermediaryState(IntermediarySheetState.switching))
        //TODO: add notification
        Alert.alert('Failed to create a new attribute')
      }
    } else {
      focusKeyboard()
      //TODO: add notification when input is empty
    }
  }

  return (
    <BasWrapper showIcon={false} customStyles={{ paddingTop: 32 }}>
      <InteractionHeader {...{ title, description }} />
      <View style={styles.inputWrapper}>
        <TextInput
          returnKeyType={'done'}
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
    width: '100%',
    justifyContent: 'center',
  },
  inputText: {
    color: Colors.white,
    fontFamily: Fonts.Regular,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0.14,
    width: '100%',
  },
})

export default IntermediarySheetBody
