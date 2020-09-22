import React, { useRef, useEffect } from 'react'
import { TextInput } from 'react-native'
import { useDispatch } from 'react-redux'
import { setIntermediaryState } from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'
import BasWrapper from './BasWrapper'
import InteractionFooter from '~/screens/Modals/Interactions/InteractionFooter'

const IntermediaryActionSheet = () => {
  const dispatch = useDispatch()
  const inputRef = useRef<TextInput>(null)

  //FIXME: when the Keyboard appears, the input is not moved above it.
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 600)
  }, [])

  const handleSubmit = () => {
    dispatch(setIntermediaryState(IntermediaryState.hiding))
  }

  return (
    <BasWrapper customStyle={{ paddingTop: 20 }}>
      <TextInput
        onSubmitEditing={handleSubmit}
        ref={inputRef}
        style={{ color: 'white' }}
      />
      <InteractionFooter />
    </BasWrapper>
  )
}

export default IntermediaryActionSheet
