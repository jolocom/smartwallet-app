import React from 'react'
import { View, StyleSheet, Text, Image, ImageBackground } from 'react-native'
import { DocumentValiditySummary } from './documentValidity'
import { DecoratedClaims } from 'src/reducers/account'
import { ClaimInterface } from 'cred-types-jolocom-core'
import { Colors, Typography } from 'src/styles'

export const DOCUMENT_CARD_HEIGHT = 176
export const DOCUMENT_CARD_WIDTH = 276

interface DocumentCardProps {
  document: DecoratedClaims
}

const styles = StyleSheet.create({
  card: {
    height: DOCUMENT_CARD_HEIGHT,
    backgroundColor: Colors.white,
    borderColor: Colors.black010,
    borderWidth: 2,
    borderRadius: 10,
    width: DOCUMENT_CARD_WIDTH,
    overflow: 'hidden',
  },
  cardBack: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardContent: {
    paddingVertical: 16,
    flex: 1,
  },
  documentType: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXL,
    paddingHorizontal: 15,
  },
  documentNumber: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXS,
    color: Colors.black040,
    paddingHorizontal: 15,
  },
  validityContainer: {
    flexDirection: 'row',
    marginTop: 'auto',
    alignItems: 'center',
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
  },
  icon: {
    marginLeft: 'auto',
    width: 42,
    height: 42,
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
