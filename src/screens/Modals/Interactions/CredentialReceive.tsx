import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useLoader } from '~/hooks/useLoader'
import { useInteraction } from '~/hooks/sdk'
import { resetInteraction } from '~/modules/interaction/actions'
import {
  getInteractionSummary,
  getIsFullScreenInteraction,
} from '~/modules/interaction/selectors'
import CredentialPlaceholderComponent from './CredentialPlaceholderComponent'
import { SignedCredentialWithMetadata } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import { ReceiveCredI } from './CredentialPlaceholderComponent'

const CredentialReceive = () => {
  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)

  const interaction = useInteraction()
  const loader = useLoader()
  const dispatch = useDispatch()

  const summary = useSelector(getInteractionSummary)
  const credentials = summary.state.offerSummary

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    isFullScreenInteraction ? [] : [credentials[0].type],
  )

  const handleCredSelect = (type: string) => {
    if (selectedTypes.indexOf(type) > -1) {
      // unselect
      setSelectedTypes((prevState) =>
        prevState.filter((selectedT: string) => selectedT !== type),
      )
    } else {
      // select
      setSelectedTypes((prevState) => [...prevState, type])
    }
  }

  const handleSubmit = async () => {
    const selectedCredentials: SignedCredentialWithMetadata[] = selectedTypes.map(
      (type) =>
        credentials.find(
          (credential: ReceiveCredI) => credential.type === type,
        ),
    )
    const success = loader(
      async () => {
        const response = await interaction.createCredentialOfferResponseToken(
          selectedCredentials,
        )
        const credentailReceive = await interaction.send(response)
        console.log({ credentailReceive })
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

export default CredentialReceive
