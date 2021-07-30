import React, { useRef, useMemo, useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import OtherCardMedium from '~/assets/svg/OtherCardMedium'
import { Fonts } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { TextLayoutEvent } from '../Card/Field'
import { getCredentialUIType } from '~/hooks/signedCredentials/utils'

/**
 * logic to define if credential text should be scaled
 */
const useCredentialNameScale = () => {
  const [isCredentialNameScaled, setIsCredentialNameScaled] = useState(false)
  const handleCredentialNameTextLayout = (e: TextLayoutEvent) => {
    if (!isCredentialNameScaled) {
      setIsCredentialNameScaled(e.nativeEvent.lines.length > 2)
    }
  }
  return {
    isCredentialNameScaled,
    handleCredentialNameTextLayout,
  }
}

/**
 * logic to define number of displayed fields
 */
const useTrimFields = <FP,>(
  fields: FP[],
  photo?: string,
  highlight?: string,
) => {
  const [displayedFields, setDisplayedFields] = useState(fields.slice(0, 3))
  const lines = useRef(0)
  const handleOptionalFieldTextLayout = () => {
    let calculatedTimes = 0
    return (e: TextLayoutEvent) => {
      calculatedTimes++
      // disable lines manipulation if the number of times this function was invoked
      // exceeds length of optional fields twice (because we calculate field name and
      // field value )
      if (calculatedTimes < fields.length * 2 + 1) {
        const numberOfLines = e.nativeEvent.lines.length
        lines.current += numberOfLines
        if (calculatedTimes === fields.length * 2) {
          /* check wether to show last optional field */
          if (lines.current > 7 && (highlight || photo)) {
            setDisplayedFields((prevState) =>
              prevState.slice(0, Math.floor(lines.current / fields.length)),
            )
          } else if (lines.current > 9 && !highlight) {
            setDisplayedFields((prevState) => prevState.slice(0, 3))
          }
        }
      }
    }
  }
  const onTextLayoutChange = handleOptionalFieldTextLayout()
  return { displayedFields, onTextLayoutChange }
}

type CredentialDocumentCardProps = {
  credentialName: string
  holderName: string
  fields: Array<Required<DisplayVal>>
  highlight?: string
  photo?: string
  onHandleMore: (id: string) => void // id is required here, to be able to delete a credential
}

export const CredentialDocumentCard: React.FC<CredentialDocumentCardProps> = ({
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
    <View style={{ position: 'relative' }}>
      <DocumentCardMedium>
        <View style={styles.documentBodyContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              // @ts-expect-error
              onTextLayout={handleCredentialNameTextLayout}
              numberOfLines={isCredentialNameScaled ? 2 : undefined}
              style={[
                styles.regularText,
                isCredentialNameScaled
                  ? styles.documentCredentialNameScaled
                  : styles.documentCredentialName,
                { flex: 0.863 },
              ]}
            >
              {credentialName}
            </Text>
          </View>
          <View style={{ paddingBottom: isCredentialNameScaled ? 22 : 16 }} />
          <View
            style={{
              paddingHorizontal: 10,
            }}
          >
            <Text
              numberOfLines={2}
              style={[styles.mediumText, styles.documentHolderName]}
            >
              {holderName}
            </Text>
          </View>
          <View style={{ paddingBottom: 16 }} />
          {displayedFields.map((f, idx) => (
            <>
              {idx !== 0 && <View style={{ paddingBottom: 14 }} />}
              <Text
                // @ts-expect-error
                onTextLayout={onTextLayoutChange}
                numberOfLines={1}
                style={[styles.regularText, styles.fieldLabel]}
              >
                {f.label}:
              </Text>
              <View style={{ paddingBottom: 9 }} />
              <Text
                // @ts-expect-error
                onTextLayout={onTextLayoutChange}
                numberOfLines={idx === displayedFields.length - 1 ? 3 : 2}
                style={[
                  styles.mediumText,
                  styles.fieldText,
                  {
                    width:
                      photo && idx === displayedFields.length - 1
                        ? '66.4%'
                        : '100%',
                  },
                ]}
              >
                {f.value}
              </Text>
            </>
          ))}
        </View>
      </DocumentCardMedium>
      {photo && (
        <View style={styles.documentPhotoContainer}>
          <Image style={styles.documentPhoto} source={{ uri: photo }} />
        </View>
      )}
      {displayedHighlight && (
        <View style={styles.documentHighlightContainer}>
          <Text
            style={[
              styles.regularText,
              styles.documentHighlight,
              {
                width: photo ? '66.4%' : '100%',
              },
            ]}
          >
            {displayedHighlight.toUpperCase()}
          </Text>
        </View>
      )}
      {/* Dots - more action */}
      <TouchableOpacity
        onPress={onHandleMore}
        style={[
          styles.dotsContainer,
          {
            top: 18,
            right: 17,
          },
        ]}
      >
        {[...Array(3).keys()].map((c) => (
          <View key={c} style={styles.dot} />
        ))}
      </TouchableOpacity>
    </View>
  )
}

type CredentialOtherCardProps = {
  credentialType: string
  credentialName: string
  fields: Array<Required<DisplayVal>>
  logo?: string
  onHandleMore: (id: string) => void // id is required here, to be able to delete a credential
}

export const CredentialOtherCard: React.FC<CredentialOtherCardProps> = ({
  credentialType,
  credentialName,
  fields,
  logo,
  onHandleMore,
}) => {
  const { isCredentialNameScaled, handleCredentialNameTextLayout } =
    useCredentialNameScale()

  /**
   * Display credential type
   */
  const displayCredentialType = useMemo(() => {
    return getCredentialUIType(credentialType)
  }, [credentialType])

  const { displayedFields, onTextLayoutChange } = useTrimFields(fields, logo)

  return (
    <View style={{ position: 'relative' }}>
      <OtherCardMedium>
        <View style={styles.otherBodyContainer}>
          <View style={{ flex: 0.29 }}>
            <Text
              numberOfLines={1}
              style={[
                styles.regularText,
                styles.otherCredentialType,
                {
                  width: logo ? '70%' : '100%',
                },
              ]}
            >
              {displayCredentialType}
            </Text>

            <View style={{ paddingBottom: 13 }} />
            <Text
              // @ts-expect-error
              onTextLayout={handleCredentialNameTextLayout}
              numberOfLines={isCredentialNameScaled ? 2 : undefined}
              style={[
                styles.regularText,
                isCredentialNameScaled
                  ? styles.otherCredentialNameScaled
                  : styles.otherCredentialName,
                {
                  letterSpacing: 0.15,
                  color: Colors.black80,
                  flexWrap: 'wrap',
                  width: logo && !isCredentialNameScaled ? '70%' : '100%',
                },
              ]}
            >
              {credentialName}
            </Text>
          </View>
          <View style={{ flex: 0.71, paddingHorizontal: 10 }}>
            {displayedFields.map((f) => (
              <>
                <View style={{ paddingBottom: 20 }} />
                {/* TODO: share the same with document card */}
                <Text
                  numberOfLines={1}
                  // @ts-expect-error
                  onTextLayout={onTextLayoutChange}
                  style={[styles.regularText, styles.fieldLabel]}
                >
                  {f.label}:
                </Text>
                <View style={{ paddingBottom: 7 }} />
                <Text
                  numberOfLines={2}
                  // @ts-expect-error
                  onTextLayout={onTextLayoutChange}
                  style={[styles.mediumText, styles.fieldText]}
                >
                  {f.value}
                </Text>
              </>
            ))}
          </View>
        </View>
      </OtherCardMedium>
      {logo && (
        <View
          style={[
            {
              position: 'absolute',
            },
            isCredentialNameScaled
              ? styles.otherLogoContainerScaled
              : styles.otherLogoContainer,
          ]}
        >
          <Image
            source={{ uri: logo }}
            style={[
              isCredentialNameScaled
                ? styles.otherLogoScaled
                : styles.otherLogo,
            ]}
          />
        </View>
      )}
      {/* Dots - more action */}
      <TouchableOpacity
        onPress={onHandleMore}
        style={[
          styles.dotsContainer,
          {
            bottom: 20,
            right: 24,
          },
        ]}
      >
        {[...Array(3).keys()].map((c) => (
          <View key={c} style={styles.dot} />
        ))}
      </TouchableOpacity>
    </View>
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
  },
  documentPhoto: {
    width: 82,
    height: 82,
    borderRadius: 41,
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
  otherBodyContainer: {
    paddingVertical: 16,
    paddingRight: 22,
    paddingLeft: 20,
    height: '100%',
  },
  otherCredentialType: {
    fontSize: 18,
    lineHeight: 18,
    letterSpacing: 0.09,
    color: Colors.jumbo,
  },
  otherCredentialName: {
    fontSize: 28,
    lineHeight: 28,
  },
  otherCredentialNameScaled: {
    fontSize: 22,
    lineHeight: 24,
  },
  otherLogoContainer: {
    top: 16,
    right: 16,
  },
  otherLogoContainerScaled: {
    top: 14,
    right: 19,
  },
  otherLogo: {
    width: 78,
    height: 78,
    borderRadius: 78 / 2,
  },
  otherLogoScaled: {
    width: 37,
    height: 37,
    borderRadius: 37 / 2,
  },

  regularText: {
    fontFamily: Fonts.Regular,
  },
  mediumText: {
    fontFamily: Fonts.Medium,
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
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    paddingHorizontal: 3,
    paddingVertical: 10,
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
