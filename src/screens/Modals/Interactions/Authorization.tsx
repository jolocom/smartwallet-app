import React from 'react'
import { useDispatch } from 'react-redux'
import { AuthorizationFlowState } from '@jolocom/sdk/js/src/lib/interactionManager/authorizationFlow'

import { useInteraction } from '~/hooks/sdk'
import { useLoader } from '~/hooks/useLoader'
import { resetInteraction } from '~/modules/interaction/actions'
import BasWrapper from '~/components/ActionSheet/BasWrapper'

const Authorization = () => {
  const interaction = useInteraction()
  const dispatch = useDispatch()
  const loader = useLoader()
  const { description, imageURL, action } = interaction.getSummary()
    .state as AuthorizationFlowState

  const handleSubmit = async () => {
    const success = loader(
      async () => {
        const authzResponse = await interaction.createAuthorizationResponse()
        await interaction.send(authzResponse)
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

export default Authorization
