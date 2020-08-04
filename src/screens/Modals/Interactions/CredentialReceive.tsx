import React from 'react'
import { View, StyleSheet, ImageBackground, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SignedCredentialWithMetadata } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import { useLoader } from '~/hooks/useLoader'
import { useInteraction } from '~/hooks/sdk'
import { resetInteraction } from '~/modules/interaction/actions'
import {
  getIsFullScreenInteraction,
  getCredentialsBySection,
} from '~/modules/interaction/selectors'
import Header from '~/components/Header'
import { strings } from '~/translations/strings'
import { CredentialSectionsUpper, ServiceIssuedCredI } from '~/types/attributes'
import { Colors } from '~/utils/colors'
import CredentialCard from './CredentialCard'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import InteractionFooter from './InteractionFooter'
import { CredentialOfferRenderInfo } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

interface CardI {
  renderInfo: CredentialOfferRenderInfo
}

const CredentialCardContainer: React.FC<CardI> = ({ children, renderInfo }) => {
  const { background } = renderInfo
  if (background && background.url) {
    return (
      <ImageBackground
        source={{ uri: background.url }}
        style={styles.credCard}
        imageStyle={{ borderRadius: 13.5 }}
      >
        {children}
      </ImageBackground>
    )
  }
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 13.5,
        backgroundColor:
          background && background.color ? background.color : Colors.white,
      }}
    >
      {children}
    </View>
  )
}

const CredentialReceive = () => {
  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)
  const sections = useSelector(getCredentialsBySection)

  const interaction = useInteraction()
  const loader = useLoader()
  const dispatch = useDispatch()

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
      <ScrollView
        contentContainerStyle={styles.credContainer}
        scrollEnabled={isFullScreenInteraction}
      >
        {Object.keys(sections).map((section) => (
          <View key={section}>
            {isFullScreenInteraction && sections[section].length ? (
              <Header
                color={Colors.white35}
                customStyles={{ alignSelf: 'flex-start' }}
              >
                {strings[section.toUpperCase() as CredentialSectionsUpper]}
              </Header>
            ) : null}

            {sections[section].map((entry: ServiceIssuedCredI) => {
              return (
                <CredentialCard disabled={entry.invalid}>
                  <CredentialCardContainer renderInfo={entry.renderInfo}>
                    <Paragraph
                      size={ParagraphSizes.large}
                      color={
                        entry.renderInfo.text
                          ? entry.renderInfo.text.color
                          : Colors.white
                      }
                    >
                      {entry.type}
                    </Paragraph>
                  </CredentialCardContainer>
                </CredentialCard>
              )
            })}
          </View>
        ))}
      </ScrollView>
      <InteractionFooter onSubmit={() => {}} />
    </>
  )
}

const styles = StyleSheet.create({
  credContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  credCard: {
    flex: 1,
    resizeMode: 'cover',
  },
})

export default CredentialReceive
