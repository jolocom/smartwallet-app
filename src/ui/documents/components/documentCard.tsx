import React from 'react'
import { View, StyleSheet, Text, Image, ImageBackground } from 'react-native'
import { DocumentValiditySummary } from './documentValidity'
import { ClaimInterface } from 'cred-types-jolocom-core'
import { Colors, Typography, Spacing } from 'src/styles'
import { CredentialOfferRenderInfo } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

export const DOCUMENT_CARD_HEIGHT = 176
export const DOCUMENT_CARD_WIDTH = 276

interface DocumentCardProps {
  credentialType: string
  renderInfo: CredentialOfferRenderInfo | undefined
  claimData?: ClaimInterface
  expires?: Date
  selected?: boolean
}

const styles = StyleSheet.create({
  card: {
    height: DOCUMENT_CARD_HEIGHT,
    width: DOCUMENT_CARD_WIDTH,
    backgroundColor: Colors.white,
    borderColor: Colors.black010,
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    paddingVertical: Spacing.MD,
  },
  documentType: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXL,
    paddingHorizontal: Spacing.MD,
  },
  documentNumber: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXS,
    color: Colors.black040,
    paddingHorizontal: Spacing.MD,
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    paddingHorizontal: Spacing.MD,
    marginTop: 'auto',
  },
  icon: {
    width: 40,
    height: 40,
    marginLeft: 'auto',
  },
  selected: {
    borderColor: Colors.joloColor,
    borderWidth: 2,
    elevation: 6,
  },
})

export const DocumentCard: React.FC<DocumentCardProps> = props => {
  const { renderInfo, claimData, credentialType, expires, selected } = props
  const { background = undefined, logo = undefined, text = undefined } =
    renderInfo || {}

  return (
    <View
      style={[
        styles.card,
        !background && { borderColor: Colors.sand },
        selected && styles.selected,
      ]}
    >
      <ImageBackground
        style={[
          styles.cardBack,
          {
            backgroundColor: (background && background.color) || 'transparent',
          },
        ]}
        source={{
          uri: background && background.url,
        }}
      />
      <View style={styles.cardContent}>
        <Text
          numberOfLines={2}
          style={[styles.documentType, { color: text && text.color }]}
        >
          {credentialType || (claimData && claimData.type)}
        </Text>
        {claimData && (
          <Text style={[styles.documentNumber, { color: text && text.color }]}>
            {claimData.documentNumber}
          </Text>
        )}
        <View style={styles.validityContainer}>
          {expires && (
            <DocumentValiditySummary
              color={text && text.color}
              expires={expires}
            />
          )}
          {logo ? (
            <Image source={{ uri: logo.url }} style={styles.icon} />
          ) : (
            <View
              style={[styles.icon, { backgroundColor: Colors.lightGrey }]}
            />
          )}
        </View>
      </View>
    </View>
  )
}
