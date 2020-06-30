import React from 'react'
import { useInteraction } from '~/hooks/sdk'
import { useDispatch } from 'react-redux'
import { AuthorizationFlowState } from '@jolocom/sdk/js/src/lib/interactionManager/authorizationFlow'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import Header, { HeaderSizes } from '~/components/Header'
import { Image, View } from 'react-native'
import { Colors } from '~/utils/colors'
import InteractionFooter from './InteractionFooter'
import {
  resetInteraction,
  resetInteractionSheet,
} from '~/modules/account/actions'
import { useLoader } from '~/hooks/useLoader'
import HyperLink from 'react-native-hyperlink'
import { strings } from '~/translations/strings'

const Authorization = () => {
  const interaction = useInteraction()
  const dispatch = useDispatch()
  const loader = useLoader()
  const summary = interaction.getSummary().state as AuthorizationFlowState
  const { description, imageURL, action } = summary
  const ctaWord = action?.split(' ')[0]
  const ctaCapitalized = ctaWord
    ? ctaWord?.charAt(0).toUpperCase() + ctaWord?.slice(1)
    : strings.AUTHORIZE

  const handleSubmit = async () => {
    const success = loader(
      async () => {
        const authzResponse = await interaction.createAuthorizationResponse()
        await interaction.send(authzResponse)
      },
      { showFailed: false, showSuccess: false },
    )
    dispatch(resetInteractionSheet())
    dispatch(resetInteraction())
    if (!success) {
      //TODO: show toast
    }
  }

  return (
    <>
      <Header size={HeaderSizes.small}>
        {`${strings.WOULD_YOU_LIKE_TO} ${action || strings.AUTHORIZE}`} ?
      </Header>
      <HyperLink
        linkDefault={true}
        linkStyle={{ textDecorationLine: 'underline' }}
      >
        <Paragraph
          size={ParagraphSizes.micro}
          customStyles={{ color: Colors.white70, marginVertical: 20 }}
        >
          {description}
        </Paragraph>
      </HyperLink>
      {imageURL && (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Image
            resizeMode="center"
            style={{ height: 230, width: 260, marginBottom: 30 }}
            source={{ uri: imageURL }}
          />
        </View>
      )}
      <InteractionFooter ctaText={ctaCapitalized} onSubmit={handleSubmit} />
    </>
  )
}

export default Authorization
