import React, { useState } from 'react'
import { Text, View, Image } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import { Fonts } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
// TODO: import from types folder once available
import { TextLayoutEvent } from '../Card/Field'

const MAX_FIELD_DOC = 2

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

    const [fieldLines, setFieldLines] = useState<Record<number, number>>({})
    const handleFieldValueLayout = (e: TextLayoutEvent, idx: number) => {
      const lines = e.nativeEvent.lines.length
      setFieldLines((prevState) => ({
        ...prevState,
        [idx]: prevState[idx] ?? lines,
      }))
    }

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
          <View
            style={{
              // width: cardWidth,
              // height: cardHeight,
              paddingBottom: 18,
              paddingTop: 16,
              paddingLeft: 20,
              paddingRight: 17,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                width: '90%',
                fontSize: 22,
                lineHeight: 24,
                letterSpacing: 0.15,
                color: Colors.black80,
                fontFamily: Fonts.Regular,
              }}
            >
              {credentialName}
            </Text>
            <View style={{ paddingBottom: 8 }} />
            <Text
              numberOfLines={2}
              // @ts-expect-error
              onTextLayout={(e: TextLayoutEvent) => handleHolderNameLayout(e)}
              style={{
                fontSize: 28,
                lineHeight: 28,
                fontFamily: Fonts.Medium,
              }}
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
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.Regular,
                        color: Colors.slateGray,
                      }}
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
                      style={{
                        fontSize: 18,
                        lineHeight: 18,
                        fontFamily: Fonts.Regular,
                        letterSpacing: 0.09,
                      }}
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
          <View
            style={[
              {
                position: 'absolute',
                zIndex: 10,
              },
              { bottom: 18, right: 17 },
            ]}
          >
            <Image
              style={{
                width: 105,
                height: 105,
                borderRadius: 105 / 2,
              }}
              source={{ uri: photo }}
            />
          </View>
        )}
        {highlight && (
          <View
            style={[
              {
                position: 'absolute',
                bottom: 0,
                width: '100%',
                backgroundColor: 'black',
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                zIndex: 9,
              },
              {
                height: 56,
                paddingTop: 17,
                paddingBottom: 13,
                paddingLeft: 23,
              },
            ]}
          >
            <Text
              style={[
                {
                  fontFamily: Fonts.Regular,
                  color: Colors.white,
                },
                { fontSize: 26 },
              ]}
            >
              {highlight.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    )
  }
