import React, { useRef, useEffect } from 'react'
import { View, TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setIntermediaryState } from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'
import { getAttributeInputKey } from '~/modules/interaction/selectors'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'

const IntermediaryActionSheet = () => {
  const dispatch = useDispatch()
  const inputType = useSelector(getAttributeInputKey)
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
