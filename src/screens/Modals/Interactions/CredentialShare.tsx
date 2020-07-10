import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useLoader } from '~/hooks/useLoader'
import { useInteraction } from '~/hooks/sdk'
import { resetInteraction } from '~/modules/interaction/actions'
import { getInteractionSummary } from '~/modules/interaction/selectors'
import CredentialPlaceholderComponent from './CredentialPlaceholderComponent'
import { CredentialVerificationSummary } from '@jolocom/sdk/js/src/lib/interactionManager/types'

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
  return (
    <CredentialPlaceholderComponent
      credentials={credentials}
      handleSubmit={handleSubmit}
      initiatorDID={summary.initiator.did}
      onSelectCredential={handleCredSelect}
    />
  )
}

export default CredentialShare
