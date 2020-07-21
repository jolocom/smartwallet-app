import React, { useRef, useEffect } from 'react'
import { View, TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
  resetInteraction,
  setIntermediaryState,
} from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'
import { getIntermediaryInputType } from '~/modules/interaction/selectors'
import InteractionHeader from './InteractionHeader'

const IntermediaryActionSheet = () => {
  const dispatch = useDispatch()
  const inputType = useSelector(getIntermediaryInputType)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 600)
  }, [])

  const handleSubmit = () => {
    dispatch(setIntermediaryState(IntermediaryState.hiding))
  }

  return (
    <View>
      <InteractionHeader
        title={`Save your ${inputType}`}
        description={`You will immidiately find your ${inputType} in the personal info section after all`}
      />
      <TextInput
        onSubmitEditing={handleSubmit}
        ref={inputRef}
        style={{ color: 'white' }}
      />
    </View>
  )
}

export default IntermediaryActionSheet
