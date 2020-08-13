import React from 'react'
import { useDispatch } from 'react-redux'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import { useInteraction } from '~/hooks/sdk'
import { useLoader } from '~/hooks/useLoader'
import { useRootSelector } from '~/hooks/useRootSelector'
import { resetInteraction } from '~/modules/interaction/actions'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import { AuthorizationDetailsI } from '~/modules/interaction/types'

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

  return <BasWrapper />
}

export default Authorization
