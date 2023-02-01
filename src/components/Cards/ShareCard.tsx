import React, { useCallback } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import ScaledCard, { ScaledView } from './ScaledCard'

import { DocumentProperty } from '~/hooks/documents/types'
import { Colors } from '~/utils/colors'
import {
  DocumentFields,
  DocumentHeader,
  DocumentHolderName,
  DocumentPhoto,
} from './components'
import {
  ORIGINAL_DOCUMENT_SHARE_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_SHARE_CARD_WIDTH,
} from './consts'

interface Props {
  credentialName: string
  issuerIcon?: string
  fields: Array<DocumentProperty>
  selected?: boolean
  holderName?: string
  photo?: string
  backgroundColor?: string
  backgroundImage?: string
  style?: StyleProp<ViewStyle>
}

const ShareCard: React.FC<Props> = ({
  credentialName,
  holderName,
  fields,
  photo,
  selected,
  issuerIcon,
  backgroundColor,
  backgroundImage,
  style = {},
}) => {
  const calculateMaxRows = useCallback(() => {
    let maxRows = 3
    if (holderName) maxRows--

    return maxRows
  }, [holderName])

  const cardHasBackground = Boolean(backgroundColor || backgroundImage)

  const maxRows = calculateMaxRows()

  return (
    <ScaledCard
      originalWidth={ORIGINAL_DOCUMENT_SHARE_CARD_WIDTH}
      originalHeight={ORIGINAL_DOCUMENT_SHARE_CARD_HEIGHT}
      style={[styles.scaledCardStyle, style]}
      scaleStyle={styles.scaledCardScaleStyle}
      scaleToFit
    >
      <View style={styles.cardContainer}>
        <DocumentHeader
          name={credentialName}
          icon={issuerIcon}
          selected={selected}
          isInteracting={true}
          backgroundColor={backgroundColor}
          backgroundImage={backgroundImage}
        />
        <View style={styles.fieldsContainer}>
          <View
            style={{
              ...styles.contentContainer,
              ...(!holderName && cardHasBackground && { marginTop: 8 }),
            }}
          >
            {holderName && (
              <DocumentHolderName name={holderName} numberOfLines={1} />
            )}
            <DocumentFields
              fields={fields}
              maxRows={maxRows}
              maxLines={1}
              rowDistance={8}
              fieldCharacterLimit={!photo ? 16 : 12}
              labelScaledStyle={styles.scaledLabel}
              valueScaledStyle={styles.scaledValue}
            />
          </View>
          {photo && (
            <ScaledView
              style={styles.scaledView}
              scaleStyle={{
                ...(cardHasBackground && { bottom: 20 }),
              }}
            >
              <DocumentPhoto photo={photo} />
            </ScaledView>
          )}
        </View>
      </View>
    </ScaledCard>
  )
}

const styles = StyleSheet.create({
  scaledCardStyle: { overflow: 'hidden', backgroundColor: Colors.white },
  scaledCardScaleStyle: { borderRadius: 13 },
  cardContainer: { flex: 1, flexDirection: 'column', width: '100%' },
  contentContainer: { flex: 1 },
  fieldsContainer: { flexDirection: 'row', flex: 1 },
  scaledView: { flex: 0.5 },
  scaledLabel: { fontSize: 14, lineHeight: 18 },
  scaledValue: { fontSize: 18, lineHeight: 20 },
})

export default ShareCard
