import React, { useRef, useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setIntermediaryState } from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'
import { getAttributeInputKey } from '~/modules/interaction/selectors'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import BasWrapper from './BasWrapper'
import InteractionFooter from '~/screens/Modals/Interactions/InteractionFooter'
import { useCreateAttributes } from '~/hooks/attributes'
import { ATTR_TYPES } from '~/types/credentials'

const IntermediaryActionSheet = () => {
  const dispatch = useDispatch()
  const inputType = useSelector(getAttributeInputKey)
  const inputRef = useRef<TextInput>(null)
  const createAttribute = useCreateAttributes()
  const [value, setValue] = useState('')

  //FIXME: when the Keyboard appears, the input is not moved above it.
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 600)
  }, [])

  const handleSubmit = async () => {
    if (!inputType) throw new Error('No attribute provided')

    try {
      await createAttribute(inputType, value)
      dispatch(setIntermediaryState(IntermediaryState.hiding))
    } catch (e) {
      console.log({ e })
    }
  }

  return (
    <BasWrapper customStyle={{ paddingTop: 20 }}>
      <TextInput
        onSubmitEditing={handleSubmit}
        ref={inputRef}
        value={value}
        onChangeText={setValue}
        style={{ color: 'white' }}
      />
      <InteractionFooter />
    </BasWrapper>
  )
}

export default IntermediaryActionSheet
