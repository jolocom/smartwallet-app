import React from 'react'
import { Image, View } from 'react-native'
import { useDispatch } from 'react-redux'
import HyperLink from 'react-native-hyperlink'
import { AuthorizationFlowState } from '@jolocom/sdk/js/src/lib/interactionManager/authorizationFlow'

import { useInteraction } from '~/hooks/sdk'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import Header, { HeaderSizes } from '~/components/Header'
import { Colors } from '~/utils/colors'
import InteractionFooter from './InteractionFooter'
import { resetInteraction } from '~/modules/interactions/actions'
import { useLoader } from '~/hooks/useLoader'
import { strings } from '~/translations/strings'
import { truncateFirstWord, capitalizeWord } from '~/utils/stringUtils'

const Authorization = () => {
  const interaction = useInteraction()
  const dispatch = useDispatch()
  const loader = useLoader()
  const { description, imageURL, action } = interaction.getSummary()
    .state as AuthorizationFlowState
  const ctaWord = action ? truncateFirstWord(action) : strings.AUTHORIZE
  const ctaCapitalized = capitalizeWord(ctaWord)

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
