import React, { useState } from 'react'
import { Text, View, Image } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import { Fonts } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
// TODO: import from types folder once available
import { TextLayoutEvent } from '../Card/Field'
import InteractionCardOther from '~/assets/svg/InteractionCardOther'
import { StyleSheet } from 'react-native'

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

type FieldsCalculatorProps<C> = (
  child: C,
  idx: number,
) => Array<Exclude<C, boolean | null | undefined>>

const FieldsCalculator = <C,>({
  children,
  cbFieldsVisibility,
}: {
  children: C | C[]
  cbFieldsVisibility: FieldsCalculatorProps<C>
}) => React.Children.map(children, cbFieldsVisibility)

type InteractionShareDocumentCardProps = {
  credentialName: string
  holderName: string
  fields: Array<Required<DisplayVal>>
  highlight?: string
  photo?: string
}

/**
 * TODO:
 * - trim highlight, take implementation from credential cards
 * - add semicolons
 * - calculate available space
 */
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
      <View
        style={{
          position: 'relative',
          // width: cardWidth
        }}
      >
        <InteractionCardDoc>
          <View style={styles.documentBodyContainer}>
            <Text
              numberOfLines={1}
              style={[styles.regularText, styles.documentCredentialName]}
            >
              {credentialName}
            </Text>
            <View style={{ paddingBottom: 8 }} />
            <Text
              numberOfLines={2}
              // @ts-expect-error
              onTextLayout={(e: TextLayoutEvent) => handleHolderNameLayout(e)}
              style={[styles.mediumText, styles.documentHolderName]}
            >
              {holderName}
            </Text>
            {/* TODO: this doesn't include logic when padding is bigger */}
            <View style={{ paddingBottom: 4 }} />
            <FieldsCalculator cbFieldsVisibility={handleFieldValuesVisibility}>
              {fields.map((f, idx) => (
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: photo ? '64.9%' : '100%' }}>
                    {idx !== 0 && <View style={{ paddingBottom: 4 }} />}
                    <Text
                      numberOfLines={1}
                      style={[styles.regularText, styles.fieldLabelDocument]}
                    >
                      {f.label}
                    </Text>
                    <View style={{ paddingBottom: 6 }} />
                    <Text
                      numberOfLines={handleNumberOfValueLinesToDisplay(idx)}
                      //@ts-expect-error
                      onTextLayout={(e: TextLayoutEvent) =>
                        handleFieldValueLayout(e, idx)
                      }
                      style={[styles.regularText, styles.fieldValue]}
                    >
                      {f.value}
                    </Text>
                  </View>
                </View>
              ))}
            </FieldsCalculator>
          </View>
        </InteractionCardDoc>
        {photo && (
          <View style={styles.documentPhotoContainer}>
            <Image style={styles.documentPhoto} source={{ uri: photo }} />
          </View>
        )}
        {highlight && (
          <View style={styles.documentHighlightContainer}>
            <Text style={[styles.regularText, styles.documentHighlight]}>
              {highlight.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    )
  }

type InteractionShareOtherCardProps = {
  credentialName: string
  fields: Array<Required<DisplayVal>>
}

/**
 * TODO:
 * - width of body
 * - semicolon after label
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
      <View
        style={{
          position: 'relative',
        }}
      >
        <InteractionCardOther>
          <View style={styles.otherBodyContainer}>
            <Text style={[styles.regularText, styles.otherCredentialName]}>
              {credentialName}
            </Text>
            <View style={{ paddingBottom: 16 }} />
            <FieldsCalculator cbFieldsVisibility={handleFieldValuesVisibility}>
              {fields.map((f, idx) => (
                <>
                  {idx !== 0 && <View style={{ paddingBottom: 12 }} />}

                  <Text style={[styles.regularText, styles.fieldLabelOther]}>
                    {f.label}
                  </Text>
                  <View style={{ paddingBottom: 4 }} />
                  {/* TODO: the same as in document card */}
                  <Text
                    numberOfLines={2}
                    //@ts-expect-error
                    onTextLayout={(e: TextLayoutEvent) =>
                      handleFieldValueLayout(e, idx)
                    }
                    style={[styles.regularText, styles.fieldValue]}
                  >
                    {f.value}
                  </Text>
                </>
              ))}
            </FieldsCalculator>
          </View>
        </InteractionCardOther>
      </View>
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
    zIndex: 10,
    bottom: 18,
    right: 17,
  },
  documentPhoto: {
    width: 105,
    height: 105,
    borderRadius: 105 / 2,
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
