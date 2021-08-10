import React, { useMemo } from 'react'
import { View, Image, StyleSheet } from 'react-native'

import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import ScaledCard, { ScaledText, ScaledView } from '../ScaledCard'
import { useCalculateFieldLines, useCredentialNameScale } from '../hooks'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'
import {
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
  ORIGINAL_DOCUMENT_SCREEN_WIDTH,
} from './consts'
import { CardMoreBtn } from './components'
import { DocumentCardProps } from './types'
import { FieldsCalculator } from '../InteractionShare/components'
import { getTrimmedHighlight } from '../utils'

const MAX_FIELDS = 3
const MAX_FIELD_LINES = 4

const DocumentSectionDocumentCard: React.FC<DocumentCardProps> = ({
  credentialName,
  holderName,
  fields,
  photo,
  highlight,
  onHandleMore,
}) => {
  const { isCredentialNameScaled, handleCredentialNameTextLayout } =
    useCredentialNameScale()

  const displayedFields = useMemo(
    () => fields.splice(0, MAX_FIELDS),
    [fields.length],
  )

  const { fieldLines, handleFieldValueLayout } = useCalculateFieldLines()

  const sumFieldLines = useMemo(() => {
    if (Object.keys(fieldLines).length === displayedFields.length) {
      return Object.keys(fieldLines).reduce(
        (acc, key) => acc + fieldLines[parseInt(key)],
        0,
      )
    }
    return 0
  }, [JSON.stringify(fieldLines)])

  /**
   * We can not display more than 5 lines of all field value lines
   */
  const handleFieldValuesVisibility = (child: React.ReactNode, idx: number) => {
    /**
     * Once nr of lines of all displayed fields was calculated
     */
    if (
      Object.keys(fieldLines).length === displayedFields.length &&
      sumFieldLines !== 0
    ) {
      /**
       * if sum of all field lines doesn't exceed max
       * amount of lines that can be displayed
       */
      if (sumFieldLines <= MAX_FIELD_LINES) {
        return child
      } else {
        /**
         * safely display lines of first and second fields,
         * because max number of lines for a field value is 2,
         * and even if both of these fields (1st, 2nd)
         * have max amount of field lines display it will still display 4 lines
         */
        if (idx === 0 || idx === 1) {
          return child
        } else {
          const remainingNrLines =
            MAX_FIELD_LINES - fieldLines[0] - fieldLines[1]
          /**
           * If no lines are left to display do not display the whole field
           */
          if (remainingNrLines === 0) {
            return null
          } else {
            /**
             * otherwise,
             * change numberOfLines display for field value
             */
            return React.Children.map(child.props.children, (c, idx) => {
              // field value child
              if (idx === child.props.children.length - 1) {
                return React.cloneElement(c, {
                  numberOfLines:
                    MAX_FIELD_LINES - fieldLines[0] - fieldLines[1],
                })
              }
              // the rest of children
              return c
            })
          }
        }
      }
    }
    return child
  }

  /**
   * trim highlight value if necessary
   */
  const displayedHighlight = useMemo(() => {
    if (highlight) {
      return getTrimmedHighlight(highlight)
    } else {
      return undefined
    }
  }, [highlight])

  return (
    <ScaledCard
      originalHeight={ORIGINAL_DOCUMENT_CARD_HEIGHT}
      originalWidth={ORIGINAL_DOCUMENT_CARD_WIDTH}
      originalScreenWidth={ORIGINAL_DOCUMENT_SCREEN_WIDTH}
      style={{ position: 'relative' }}
      testID="documentCard"
    >
      <DocumentCardMedium>
        <ScaledView scaleStyle={styles.bodyContainer}>
          <View style={{ flexDirection: 'row' }}>
            <ScaledText
              // @ts-expect-error
              onTextLayout={handleCredentialNameTextLayout}
              numberOfLines={isCredentialNameScaled ? 2 : undefined}
              scaleStyle={
                isCredentialNameScaled
                  ? styles.credentialNameScaled
                  : styles.credentialName
              }
              style={[styles.regularText, { flex: 0.863 }]}
            >
              {credentialName}
            </ScaledText>
          </View>
          <ScaledView
            scaleStyle={{ paddingBottom: isCredentialNameScaled ? 22 : 16 }}
          />
          <ScaledView
            scaleStyle={{
              paddingHorizontal: 10,
            }}
          >
            <ScaledText
              numberOfLines={2}
              style={styles.mediumText}
              scaleStyle={styles.holderName}
            >
              {holderName}
            </ScaledText>
          </ScaledView>
          <ScaledView scaleStyle={{ paddingBottom: 16 }} />
          <FieldsCalculator cbFieldsVisibility={handleFieldValuesVisibility}>
            {displayedFields.map((f, idx) => (
              <>
                {idx !== 0 && <ScaledView scaleStyle={{ paddingBottom: 14 }} />}
                <ScaledText
                  numberOfLines={1}
                  style={styles.regularText}
                  scaleStyle={styles.fieldLabel}
                >
                  {f.label.trim()}:
                </ScaledText>
                <ScaledView scaleStyle={{ paddingBottom: 9 }} />
                <ScaledText
                  numberOfLines={2}
                  //@ts-expect-error
                  onTextLayout={(e: TextLayoutEvent) =>
                    handleFieldValueLayout(e, idx)
                  }
                  scaleStyle={styles.fieldText}
                  style={[
                    styles.mediumText,
                    {
                      width:
                        photo && idx === displayedFields.length - 1
                          ? '66.4%'
                          : '100%',
                    },
                  ]}
                >
                  {f.value}
                </ScaledText>
              </>
            ))}
          </FieldsCalculator>
        </ScaledView>
      </DocumentCardMedium>
      {photo && (
        <ScaledView
          scaleStyle={styles.photoContainerScaled}
          style={styles.photoContainer}
        >
          <Image
            resizeMode="cover"
            style={styles.photo}
            source={{ uri: photo }}
          />
        </ScaledView>
      )}
      {displayedHighlight && (
        <ScaledView
          style={styles.highlightContainer}
          scaleStyle={styles.highlightContainerScaled}
        >
          <ScaledText
            scaleStyle={[styles.highlight]}
            style={[
              styles.regularText,
              {
                width: photo ? '66.4%' : '100%',
              },
            ]}
          >
            {displayedHighlight.toUpperCase()}
          </ScaledText>
        </ScaledView>
      )}
      {/* Dots - more action */}
      <CardMoreBtn
        onPress={onHandleMore}
        positionStyles={{
          top: 18,
          right: 17,
        }}
      />
    </ScaledCard>
  )
}

const styles = StyleSheet.create({
  bodyContainer: {
    paddingTop: 22,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  credentialName: {
    fontSize: 28,
    lineHeight: 28,
  },
  credentialNameScaled: {
    fontSize: 22,
    lineHeight: 22,
  },
  holderName: {
    fontSize: 20,
    lineHeight: 20,
  },
  photoContainer: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 10,
  },
  photoContainerScaled: {
    bottom: 27,
    right: 14,
    width: 82,
    height: 82,
    borderRadius: 41,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  highlightContainerScaled: {
    bottom: 0,
    height: 56,
    paddingTop: 17,
    paddingBottom: 13,
    paddingLeft: 23,
  },
  highlightContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: Colors.black,
    zIndex: 9,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  highlight: {
    fontSize: 26,
    color: Colors.white90,
  },
  regularText: {
    fontFamily: Fonts.Regular,
    color: Colors.black,
  },
  mediumText: {
    fontFamily: Fonts.Medium,
    color: Colors.black,
  },
  fieldLabel: {
    fontSize: 16,
    lineHeight: 16,
    color: Colors.slateGray,
  },
  fieldText: {
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 0.14,
  },
})

export default DocumentSectionDocumentCard
