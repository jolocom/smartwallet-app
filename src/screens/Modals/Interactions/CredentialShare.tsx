import React from 'react'
import { useDispatch } from 'react-redux'

import Header from '~/components/Header'
import {
  setIntermediaryState,
  setAttributeInputKey,
} from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'

const CredentialShare = () => {
  const dispatch = useDispatch()

  const handleShowIntermediary = () => {
    dispatch(setIntermediaryState(IntermediaryState.showing))
    dispatch(setAttributeInputKey('email'))
  }

  return <Header>Credential Share</Header>
}

export default CredentialShare
