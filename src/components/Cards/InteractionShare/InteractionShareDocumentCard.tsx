import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'

import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import { TextLayoutEvent } from '~/types/props'
import { Colors } from '~/utils/colors'
import { commonStyles } from '../commonStyles'
import { useCalculateFieldLines } from '../hooks'
import ScaledCard, { ScaledText, ScaledView } from '../ScaledCard'

import { FieldsCalculator } from './components'
import {
  MAX_FIELD_DOC,
  ORIGINAL_DOCUMENT_SHARE_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_SHARE_CARD_WIDTH,
} from './consts'
import { shareStyles } from './styles'
import { InteractionShareDocumentCardProps } from './types'

export const InteractionShareDocumentCard: React.FC<InteractionShareDocumentCardProps> =
  ({ credentialName, holderName, fields, photo, highlight }) => {
    /**
     * Logic to calculate number of lines a holder name takes
     * to decide how many fields can be displayed
     */
    const [holderNameLines, setHolderNameLines] = useState(0)
    const handleHolderNameLayout = (e: TextLayoutEvent) => {
      const lines = e.nativeEvent.lines.length
      setHolderNameLines(lines)
    }

    const { fieldLines, handleFieldValueLayout } = useCalculateFieldLines()

    const handleFieldValuesVisibility = (
      child: React.ReactNode,
      idx: number,
    ) => {
      if (idx + 1 > MAX_FIELD_DOC) {
        /* 1. Do not display anything that is more than max */
        return null
      } else if (
        (!!highlight && idx > 0 && fieldLines[0] > 1) ||
        (!!highlight && idx > 0 && holderNameLines > 1)
      ) {
        /**
         * 2. Do not display all the fields besides first if number of
         * lines of the first field is more than 1 and there is a highlight
         */
        return null
      }
      return child
    }

    const handleNumberOfValueLinesToDisplay = (idx: number) =>
      idx !== 0 ? (fieldLines[0] > 1 || !!highlight ? 1 : 2) : 2

    return (
      <ScaledCard
        originalWidth={ORIGINAL_DOCUMENT_SHARE_CARD_WIDTH}
        originalHeight={ORIGINAL_DOCUMENT_SHARE_CARD_HEIGHT}
        scaleToFit
      >
        <InteractionCardDoc>
          <ScaledView scaleStyle={styles.documentBodyContainer}>
            <ScaledText
              numberOfLines={1}
              scaleStyle={styles.documentCredentialName}
              style={commonStyles.regularText}
            >
              {credentialName}
            </ScaledText>
            <ScaledView scaleStyle={{ paddingBottom: 8 }} />
            <ScaledText
              numberOfLines={2}
              // @ts-expect-error
              onTextLayout={(e: TextLayoutEvent) => handleHolderNameLayout(e)}
              scaleStyle={styles.documentHolderName}
              style={commonStyles.mediumText}
            >
              {holderName}
            </ScaledText>
            {/* TODO: this doesn't include logic when padding is bigger */}
            <ScaledView scaleStyle={{ paddingBottom: 4 }} />
            <FieldsCalculator cbFieldsVisibility={handleFieldValuesVisibility}>
              {fields.map((f, idx) => (
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: photo ? '64.9%' : '100%' }}>
                    {idx !== 0 && (
                      <ScaledView scaleStyle={{ paddingBottom: 4 }} />
                    )}
                    <ScaledText
                      numberOfLines={1}
                      scaleStyle={commonStyles.fieldLabel}
                      style={commonStyles.regularText}
                    >
                      {f.label}:
                    </ScaledText>
                    <ScaledView scaleStyle={{ paddingBottom: 6 }} />
                    <ScaledText
                      numberOfLines={handleNumberOfValueLinesToDisplay(idx)}
                      //@ts-expect-error
                      onTextLayout={(e: TextLayoutEvent) =>
                        handleFieldValueLayout(e, idx)
                      }
                      scaleStyle={shareStyles.fieldValue}
                      style={commonStyles.regularText}
                    >
                      {f.value}
                    </ScaledText>
                  </View>
                </View>
              ))}
            </FieldsCalculator>
          </ScaledView>
        </InteractionCardDoc>
        {photo && (
          <ScaledView
            scaleStyle={styles.documentPhotoContainer}
            style={{ zIndex: 10 }}
          >
            <Image
              style={styles.documentPhoto}
              source={{ uri: photo }}
              resizeMode="cover"
            />
          </ScaledView>
        )}
        {highlight && (
          <ScaledView
            style={{
              zIndex: 9,
              borderBottomLeftRadius: 9,
              borderBottomRightRadius: 9,
            }}
            scaleStyle={styles.documentHighlightContainer}
          >
            <ScaledText
              numberOfLines={1}
              scaleStyle={styles.documentHighlight}
              style={[
                commonStyles.regularText,
                {
                  width: photo ? '76%' : '100%',
                },
              ]}
            >
              {highlight.toUpperCase()}
            </ScaledText>
          </ScaledView>
        )}
      </ScaledCard>
    )
  }

const styles = StyleSheet.create({
  documentBodyContainer: {
    paddingBottom: 18,
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 17,
  },
  documentCredentialName: {
    width: '90%',
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: Colors.black80,
  },
  documentHolderName: {
    fontSize: 28,
    lineHeight: 28,
  },
  documentPhotoContainer: {
    position: 'absolute',
    overflow: 'hidden',
    bottom: 18,
    right: 17,
    borderRadius: 105 / 2,
    width: 105,
    height: 105,
  },
  documentPhoto: {
    width: '100%',
    height: '100%',
  },
  documentHighlightContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'black',
    zIndex: 9,
    height: 56,
    paddingTop: 17,
    paddingBottom: 13,
    paddingHorizontal: 23,
  },
  documentHighlight: {
    color: Colors.white,
    fontSize: 26,
  },
})
