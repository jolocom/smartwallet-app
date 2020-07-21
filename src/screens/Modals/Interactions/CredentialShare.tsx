import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View } from 'react-native'

import { useLoader } from '~/hooks/useLoader'
import { useInteraction } from '~/hooks/sdk'
import {
  resetInteraction,
  setIntermediaryState,
  setIntermediaryInputType,
} from '~/modules/interaction/actions'
import { getInteractionSummary } from '~/modules/interaction/selectors'
import { CredentialVerificationSummary } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import Btn from '~/components/Btn'
import { IntermediaryState } from '~/modules/interaction/types'
import InteractionFooter from './InteractionFooter'

const CredentialShare = () => {
  const [selected, setSelected] = useState<CredentialVerificationSummary[]>([])

  const interaction = useInteraction()
  const loader = useLoader()
  const dispatch = useDispatch()

  const summary = useSelector(getInteractionSummary)
  const credentials = summary.state.constraints[0].credentialRequirements

  const handleCredSelect = () => {}

  const handleSubmit = async () => {
    const success = loader(
      async () => {
        const response = await interaction.createCredentialResponse(selected)
        await interaction.send(response)
      },
      { showFailed: false, showSuccess: false },
    )
    dispatch(resetInteraction())
    if (!success) {
      //TODO: show toast
    }
  }

  const handleShowIntermediary = () => {
    dispatch(setIntermediaryState(IntermediaryState.showing))
    dispatch(setIntermediaryInputType('email'))
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
