import React from 'react'
import { View, StyleSheet, Text, Image, ImageBackground } from 'react-native'
import { DocumentValiditySummary } from './documentValidity'
import { DecoratedClaims } from 'src/reducers/account'
import { ClaimInterface } from 'cred-types-jolocom-core'
import { Colors, Typography, Spacing } from 'src/styles'

export const DOCUMENT_CARD_HEIGHT = 176
export const DOCUMENT_CARD_WIDTH = 276

interface DocumentCardProps {
  document: DecoratedClaims
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
})

export const DocumentCard: React.SFC<DocumentCardProps> = ({
  document,
}): JSX.Element => {
  const { renderInfo, expires } = document
  const { background = undefined, logo = undefined, text = undefined } =
    renderInfo || {}
  const claimData = document.claimData as ClaimInterface

  return (
    <View style={[styles.card, !background && { borderColor: Colors.sand }]}>
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
          {claimData.type || document.credentialType}
        </Text>
        <Text style={[styles.documentNumber, { color: text && text.color }]}>
          {claimData.documentNumber}
        </Text>
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
