import React from 'react'
import { useDispatch } from 'react-redux'
import { AuthenticationFlowState } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import { useInteraction } from '~/hooks/sdk'
import { useLoader } from '~/hooks/useLoader'
import { resetInteraction } from '~/modules/interaction/actions'
import BasWrapper from '~/components/ActionSheet/BasWrapper'

const Authentication = () => {
  const interaction = useInteraction()
  const dispatch = useDispatch()
  const loader = useLoader()
  const { description } = interaction.getSummary()
    .state as AuthenticationFlowState

  const handleSubmit = async () => {
    const success = loader(
      async () => {
        const authResponse = await interaction.createAuthenticationResponse()
        await interaction.send(authResponse)
      },
      { showFailed: false, showSuccess: false },
    )
    dispatch(resetInteraction())
    if (!success) {
      //TODO: show toast
    }
  }

  return <BasWrapper onSubmit={handleSubmit}></BasWrapper>
}

export default Authentication
