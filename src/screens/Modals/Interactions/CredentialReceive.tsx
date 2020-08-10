import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SignedCredentialWithMetadata } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import { useLoader } from '~/hooks/useLoader'
import { useInteraction } from '~/hooks/sdk'
import { resetInteraction } from '~/modules/interaction/actions'
import { getIsFullScreenInteraction } from '~/modules/interaction/selectors'
import Header from '~/components/Header'
import InteractionFooter from './InteractionFooter'

const CredentialReceive = () => {
  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)

  const interaction = useInteraction()
  const loader = useLoader()
  const dispatch = useDispatch()

  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

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
    const selectedCredentials: SignedCredentialWithMetadata[] = []
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
    <>
      <Header>Credential Receive</Header>
      <InteractionFooter onSubmit={() => {}} />
    </>
  )
}

export default CredentialReceive
