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
        <ScaledView scaleStyle={styles.documentBodyContainer}>
          <View style={{ flexDirection: 'row' }}>
            <ScaledText
              // @ts-expect-error
              onTextLayout={handleCredentialNameTextLayout}
              numberOfLines={isCredentialNameScaled ? 2 : undefined}
              scaleStyle={[
                styles.regularText,
                isCredentialNameScaled
                  ? styles.documentCredentialNameScaled
                  : styles.documentCredentialName,
              ]}
              style={[{ flex: 0.863 }]}
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
              scaleStyle={[styles.mediumText, styles.documentHolderName]}
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
                scaleStyle={[styles.regularText, styles.fieldLabel]}
              >
                {f.label}:
              </ScaledText>
              <ScaledView scaleStyle={{ paddingBottom: 9 }} />
              <ScaledText
                // @ts-expect-error
                onTextLayout={onTextLayoutChange}
                numberOfLines={idx === displayedFields.length - 1 ? 3 : 2}
                scaleStyle={[styles.mediumText, styles.fieldText]}
                style={{
                  width:
                    photo && idx === displayedFields.length - 1
                      ? '66.4%'
                      : '100%',
                }}
              >
                {f.value}
              </ScaledText>
            </>
          ))}
        </ScaledView>
      </DocumentCardMedium>
      {photo && (
        <ScaledView scaleStyle={styles.documentPhotoContainer}>
          <Image
            resizeMode="cover"
            style={styles.documentPhoto}
            source={{ uri: photo }}
          />
        </ScaledView>
      )}
      {displayedHighlight && (
        <ScaledView scaleStyle={styles.documentHighlightContainer}>
          <ScaledText
            scaleStyle={[styles.regularText, styles.documentHighlight]}
            style={{
              width: photo ? '66.4%' : '100%',
            }}
          >
            {displayedHighlight.toUpperCase()}
          </ScaledText>
        </ScaledView>
      )}
      {/* Dots - more action */}
      <ScaledView
        scaleStyle={[
          styles.dotsContainer,
          {
            top: 18,
            right: 17,
          },
        ]}
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
  documentBodyContainer: {
    paddingTop: 22,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  documentCredentialName: {
    fontSize: 28,
    lineHeight: 28,
  },
  documentCredentialNameScaled: {
    fontSize: 22,
    lineHeight: 22,
  },
  documentHolderName: {
    fontSize: 20,
    lineHeight: 20,
  },
  documentPhotoContainer: {
    position: 'absolute',
    bottom: 27,
    right: 14,
    zIndex: 10,
    width: 82,
    height: 82,
    borderRadius: 41,
    overflow: 'hidden',
  },
  documentPhoto: {
    width: '100%',
    height: '100%',
  },
  documentHighlightContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.black,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 9,
    height: 56,
    paddingTop: 17,
    paddingBottom: 13,
    paddingLeft: 23,
  },
  documentHighlight: {
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
  dotsContainer: {
    position: 'absolute',
    paddingHorizontal: 3,
    paddingVertical: 10,
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
