import React from 'react'
import { useDispatch } from 'react-redux'
import { View } from 'react-native'

import {
  setIntermediaryState,
  setAttributeInputKey,
} from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'
import InteractionFooter from './InteractionFooter'

const CredentialShare = () => {
  const dispatch = useDispatch()

  const handleShowIntermediary = () => {
    dispatch(setIntermediaryState(IntermediaryState.showing))
    dispatch(setAttributeInputKey('email'))
  }

  return (
    <View>
      <InteractionFooter
        customCTA={'Create email'}
        onSubmit={handleShowIntermediary}
      />
    </View>
  )
}

export default CredentialShare
