import React from 'react'
import { useDispatch } from 'react-redux'

import FasWrapper from '~/components/ActionSheet/FasWrapper'
import {
  setIntermediaryState,
  setAttributeInputKey,
} from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'
import CredentialCard from './CredentialCard'
import Header from '~/components/Header'

const CredentialShare = () => {
  const dispatch = useDispatch()
  return (
    <FasWrapper
      onSubmit={() => {
        dispatch(setIntermediaryState(IntermediaryState.showing))
        dispatch(setAttributeInputKey('name'))
      }}
    ></FasWrapper>
  )
}

export default CredentialShare
