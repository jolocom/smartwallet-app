import React from 'react'
import { useDispatch } from 'react-redux'

import { useInteraction } from '~/hooks/sdk'
import { useLoader } from '~/hooks/useLoader'
import { resetInteraction } from '~/modules/interaction/actions'
import BasWrapper from '~/components/ActionSheet/BasWrapper'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import { AuthorizationDetailsI } from '~/modules/interaction/types'
import { useRootSelector } from '~/hooks/useRootSelector'

const Authorization = () => {
  const interaction = useInteraction()
  const dispatch = useDispatch()
  const loader = useLoader()
  const { image } = useRootSelector<AuthorizationDetailsI>(
    getInteractionDetails,
  )

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
