import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View } from 'react-native'

import {
  setIntermediaryState,
  setAttributeInputKey,
} from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'
import InteractionFooter from './InteractionFooter'
import InteractionHeader from './InteractionHeader'
import { InteractionSummary } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { getInteractionSummary } from '~/modules/interaction/selectors'

const FAS: React.FC = ({ children }) => {
  const { initiator }: InteractionSummary = useSelector(getInteractionSummary)

  return (
    <>
      <InteractionHeader title={'Incoming request'} description />
      <View style={{ flex: 1 }}>{children}</View>
      <InteractionFooter />
    </>
  )
}

const CredentialShare = () => {
  const dispatch = useDispatch()

  return <FAS></FAS>
}

export default CredentialShare
