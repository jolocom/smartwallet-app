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
      <Header size={HeaderSizes.small}>
        {strings.WOULD_YOU_LIKE_TO_AUTHENTICATE}
      </Header>
      <HyperLink
        linkDefault={true}
        linkStyle={{ textDecorationLine: 'underline' }}
      >
        <Paragraph size={ParagraphSizes.micro} customStyles={styles.paragraph}>
          {description}
        </Paragraph>
      </HyperLink>
      <InteractionFooter
        ctaText={strings.AUTHENTICATE}
        onSubmit={handleSubmit}
      />
    </>
  )
}

const styles = StyleSheet.create({
  paragraph: {
    color: Colors.white70,
    marginVertical: 20,
  },
})

export default Authentication
