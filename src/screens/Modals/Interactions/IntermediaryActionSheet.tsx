import React from 'react'
import { View } from 'react-native'
import Btn from '~/components/Btn'
import { useDispatch } from 'react-redux'
import {
  resetInteraction,
  setIntermediaryState,
} from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'

const IntermediaryActionSheet = () => {
  const dispatch = useDispatch()

  const handleSubmit = () => {
    dispatch(setIntermediaryState(IntermediaryState.hiding))
  }

  const handleCancel = () => {
    dispatch(resetInteraction())
  }

  return (
    <View>
      <Btn onPress={handleSubmit}>Submit</Btn>
      <Btn onPress={handleCancel}>Cancel</Btn>
    </View>
  )
}

export default IntermediaryActionSheet
