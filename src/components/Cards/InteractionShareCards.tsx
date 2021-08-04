import React, { useState } from 'react'
import { View, Image } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import { Fonts } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import InteractionCardOther from '~/assets/svg/InteractionCardOther'
import { StyleSheet } from 'react-native'
import { TextLayoutEvent } from '~/types/props'
import { useMemo } from 'react'
import { getTrimmedHighlight } from './utils'
import ScaledCard, { ScaledText, ScaledView } from './ScaledCard'

const MAX_FIELD_DOC = 2
const MAX_FIELD_OTHER = 3

const useCalculateFieldLines = () => {
  const [fieldLines, setFieldLines] = useState<Record<number, number>>({})
  const handleFieldValueLayout = (e: TextLayoutEvent, idx: number) => {
    const lines = e.nativeEvent.lines.length
    setFieldLines((prevState) => ({
      ...prevState,
      [idx]: prevState[idx] ?? lines,
    }))
  }
  return {
    fieldLines,
    handleFieldValueLayout,
  }
}

type FieldsCalculatorProps = (
  child: React.ReactNode,
  idx: number,
) => React.ReactNode

const FieldsCalculator: React.FC<{
  cbFieldsVisibility: FieldsCalculatorProps
}> = ({ children, cbFieldsVisibility }) =>
  React.Children.map(children, cbFieldsVisibility) as React.ReactElement<
    unknown,
    string
  > | null

type InteractionShareDocumentCardProps = {
  credentialName: string
  holderName: string
  fields: Array<Required<DisplayVal>>
  highlight?: string
  photo?: string
}

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

    const displayedHighlight = useMemo(
      () => getTrimmedHighlight(highlight),
      [highlight],
    )

    const { fieldLines, handleFieldValueLayout } = useCalculateFieldLines()

    const handleFieldValuesVisibility = (child, idx) => {
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
      <ScaledCard originalWidth={368} originalHeight={232} scaleToFit>
        <InteractionCardDoc>
          <ScaledView scaleStyle={styles.documentBodyContainer}>
            <ScaledText
              numberOfLines={1}
              scaleStyle={styles.documentCredentialName}
              style={styles.regularText}
            >
              {credentialName}
            </ScaledText>
            <ScaledView scaleStyle={{ paddingBottom: 8 }} />
            <ScaledText
              numberOfLines={2}
              // @ts-expect-error
              onTextLayout={(e: TextLayoutEvent) => handleHolderNameLayout(e)}
              scaleStyle={styles.documentHolderName}
              style={styles.mediumText}
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
                      scaleStyle={styles.fieldLabelDocument}
                      style={styles.regularText}
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
                      scaleStyle={styles.fieldValue}
                      style={styles.regularText}
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
        {displayedHighlight && (
          <ScaledView
            style={{ zIndex: 9 }}
            scaleStyle={styles.documentHighlightContainer}
          >
            <ScaledText
              scaleStyle={styles.documentHighlight}
              style={styles.regularText}
            >
              {displayedHighlight.toUpperCase()}
            </ScaledText>
          </ScaledView>
        )}
      </ScaledCard>
    )
  }

type InteractionShareOtherCardProps = {
  credentialName: string
  fields: Array<Required<DisplayVal>>
}

/**
 * TODO:
 * - width of body
 */
export const InteractionShareOtherCard: React.FC<InteractionShareOtherCardProps> =
  ({ credentialName, fields }) => {
    const { fieldLines, handleFieldValueLayout } = useCalculateFieldLines()

    const handleFieldValuesVisibility = (
      child: React.ReactNode,
      idx: number,
    ) => {
      if (idx + 1 > MAX_FIELD_OTHER) {
        /* 1. Do not display anything that is more than max */
        return null
      } else if (
        fieldLines[0] &&
        fieldLines[1] &&
        fieldLines[0] + fieldLines[1] > 2 &&
        idx > 1
      ) {
        /* 2. If the sum of first and second field values is greater than 2 do not display anything later*/
        return null
      }
      return child
    }

    return (
      <ScaledCard originalHeight={232} originalWidth={368} scaleToFit>
        <InteractionCardOther>
          <ScaledView scaleStyle={styles.otherBodyContainer}>
            <ScaledText
              numberOfLines={2}
              scaleStyle={styles.otherCredentialName}
              style={styles.regularText}
            >
              {credentialName}
            </ScaledText>
            <ScaledView scaleStyle={{ paddingBottom: 16 }} />
            <FieldsCalculator cbFieldsVisibility={handleFieldValuesVisibility}>
              {fields.map((f, idx) => (
                <>
                  {idx !== 0 && (
                    <ScaledView scaleStyle={{ paddingBottom: 12 }} />
                  )}

                  <ScaledText
                    scaleStyle={styles.fieldLabelOther}
                    style={styles.regularText}
                  >
                    {f.label}:
                  </ScaledText>
                  <ScaledView scaleStyle={{ paddingBottom: 4 }} />
                  {/* TODO: the same as in document card */}
                  <ScaledText
                    numberOfLines={2}
                    //@ts-expect-error
                    onTextLayout={(e: TextLayoutEvent) =>
                      handleFieldValueLayout(e, idx)
                    }
                    scaleStyle={styles.fieldValue}
                    style={styles.regularText}
                  >
                    {f.value}
                  </ScaledText>
                </>
              ))}
            </FieldsCalculator>
          </ScaledView>
        </InteractionCardOther>
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
  otherBodyContainer: {
    // TODO: correct values once available
    // add width once available
    paddingBottom: 18,
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 17,
    width: '73%',
  },
  otherCredentialName: {
    color: Colors.black80,
    fontSize: 22,
    lineHeight: 24,
  },
  // TODO: the same as credentials
  regularText: {
    fontFamily: Fonts.Regular,
    color: Colors.black,
  },
  // TODO: the same as credentials
  mediumText: {
    fontFamily: Fonts.Medium,
    color: Colors.black,
  },
  fieldLabelDocument: {
    fontSize: 14,
    color: Colors.slateGray,
  },
  // TODO: the same as credentials
  fieldLabelOther: {
    fontSize: 16,
    lineHeight: 16,
    color: Colors.slateGray,
  },
  fieldValue: {
    fontSize: 18,
    lineHeight: 18,
    letterSpacing: 0.09,
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
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 9,
    height: 56,
    paddingTop: 17,
    paddingBottom: 13,
    paddingLeft: 23,
  },
  documentHighlight: {
    color: Colors.white,
    fontSize: 26,
  },
})
