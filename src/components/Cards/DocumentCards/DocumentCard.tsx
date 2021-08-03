import React, { useMemo } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import ScaledCard, { ScaledText, ScaledView } from '../ScaledCard'
import { useCredentialNameScale, useTrimFields } from '../hooks'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'

type DocumentCardProps = {
  credentialName: string
  holderName: string
  fields: Array<Required<DisplayVal>>
  highlight?: string
  photo?: string
  onHandleMore: (id: string) => void // id is required here, to be able to delete a credential
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  credentialName,
  holderName,
  fields,
  photo,
  highlight,
  onHandleMore,
}) => {
  const { isCredentialNameScaled, handleCredentialNameTextLayout } =
    useCredentialNameScale()

  const { displayedFields, onTextLayoutChange } = useTrimFields(
    fields,
    photo,
    highlight,
  )

  /**
   * trim highlight value if necessary
   */
  const displayedHighlight = useMemo(() => {
    if (highlight) {
      return highlight?.length > 14
        ? highlight?.slice(0, 14) + '...'
        : highlight
    } else {
      return undefined
    }
  }, [highlight])

  return (
    <ScaledCard
      originalHeight={398}
      originalWidth={320}
      originalScreenWidth={375}
      style={{ position: 'relative' }}
      testID="otherCard"
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
          {displayedFields.map((f, idx) => (
            <>
              {idx !== 0 && <ScaledView scaleStyle={{ paddingBottom: 14 }} />}
              <ScaledText
                // @ts-expect-error
                onTextLayout={onTextLayoutChange}
                numberOfLines={1}
                style={styles.regularText}
                scaleStyle={styles.fieldLabel}
              >
                {f.label}:
              </ScaledText>
              <ScaledView scaleStyle={{ paddingBottom: 9 }} />
              <ScaledText
                // @ts-expect-error
                onTextLayout={onTextLayoutChange}
                numberOfLines={idx === displayedFields.length - 1 ? 3 : 2}
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
      <ScaledView
        scaleStyle={styles.dotsContainerScaled}
        style={styles.dotsContainer}
      >
        <TouchableOpacity onPress={onHandleMore} style={styles.dotsBtn}>
          {[...Array(3).keys()].map((c) => (
            <ScaledView key={c} scaleStyle={styles.dot} />
          ))}
        </TouchableOpacity>
      </ScaledView>
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
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
  dotsContainerScaled: {
    paddingHorizontal: 3,
    paddingVertical: 10,
    top: 18,
    right: 17,
  },
  dotsContainer: {
    position: 'absolute',
    zIndex: 100,
  },
  dotsBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
    backgroundColor: Colors.black,
  },
})

export default DocumentCard
