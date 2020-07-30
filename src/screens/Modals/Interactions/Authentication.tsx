import React from 'react'
import { StyleSheet } from 'react-native'
import HyperLink from 'react-native-hyperlink'
import { useDispatch } from 'react-redux'
import { AuthenticationFlowState } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import Header, { HeaderSizes } from '~/components/Header'

import { useInteraction } from '~/hooks/sdk'
import { useLoader } from '~/hooks/useLoader'

import { resetInteraction } from '~/modules/interaction/actions'

import { Colors } from '~/utils/colors'

import { strings } from '~/translations/strings'

import InteractionFooter from './InteractionFooter'
import InteractionHeader from './InteractionHeader'

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

  return (
    <>
      <InteractionHeader />
      <InteractionFooter onSubmit={handleSubmit} />
    </>
  )
}

export default Authentication
