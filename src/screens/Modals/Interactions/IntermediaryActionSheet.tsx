import React, { useRef, useEffect } from 'react'
import { View, TextInput } from 'react-native'
import Btn from '~/components/Btn'
import { useDispatch } from 'react-redux'
import {
  resetInteraction,
  setIntermediaryState,
} from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'

const IntermediaryActionSheet = () => {
  const dispatch = useDispatch()
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 600)
  }, [])

  const handleSubmit = () => {
    dispatch(setIntermediaryState(IntermediaryState.hiding))
  }

  const handleCancel = () => {
    dispatch(resetInteraction())
  }

  return (
    <View>
      <TextInput ref={inputRef} style={{ color: 'white' }} />
      <Btn onPress={handleSubmit}>Submit</Btn>
      <Btn onPress={handleCancel}>Cancel</Btn>
    </View>
  )
}

export default IntermediaryActionSheet
