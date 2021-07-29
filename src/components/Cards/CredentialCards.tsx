import React, { useRef, useMemo, useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import OtherCardMedium from '~/assets/svg/OtherCardMedium'
import { Fonts } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import Space from '../Space'
import { TextLayoutEvent } from '../Card/Field'
import { getCredentialUIType } from '~/hooks/signedCredentials/utils'

type CredentialDocumentCardProps = {
  credentialName: string
  holderName: string
  fields: Array<Required<DisplayVal>>
  highlight?: string
  photo?: string
  onHandleMore: (id: string) => void // id is required here, to be able to delete a credential
}

/**
 * TODO:
 * - if given name or family name is not provided it displays 'not specified'
 */
export const CredentialDocumentCard: React.FC<CredentialDocumentCardProps> = ({
  credentialName,
  holderName,
  fields,
  photo,
  highlight,
  onHandleMore,
}) => {
  /**
   * logic to define if credential text should be scaled
   */
  const [isCredentialNameScaled, setIsCredentialNameScaled] = useState(false)
  const handleCredentialNameTextLayout = (e: TextLayoutEvent) => {
    if (!isCredentialNameScaled) {
      setIsCredentialNameScaled(e.nativeEvent.lines.length > 2)
    }
  }

  /**
   * logic to define number of displayed fields
   */
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
        <View
          style={{
            paddingTop: 22,
            paddingHorizontal: 14,
            paddingBottom: 14,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text
              // @ts-expect-error
              onTextLayout={handleCredentialNameTextLayout}
              numberOfLines={isCredentialNameScaled ? 2 : undefined}
              style={{
                fontSize: isCredentialNameScaled ? 22 : 28,
                lineHeight: isCredentialNameScaled ? 22 : 28,
                fontFamily: Fonts.Regular,
                flex: 0.863,
              }}
            >
              {credentialName}
            </Text>
          </View>
          <Space height={isCredentialNameScaled ? 22 : 16} />
          <View
            style={{
              paddingHorizontal: 10,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                fontSize: 20,
                lineHeight: 20,
                fontFamily: Fonts.Medium,
              }}
            >
              {holderName}
            </Text>
          </View>
          <Space height={16} />
          {displayedFields.map((f, idx) => (
            <>
              {idx !== 0 && <Space height={14} />}
              <Text
                // @ts-expect-error
                onTextLayout={onTextLayoutChange}
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  lineHeight: 16,
                  fontFamily: Fonts.Regular,
                  color: Colors.slateGray,
                }}
              >
                {f.label}:
              </Text>
              <Space height={9} />
              <Text
                // @ts-expect-error
                onTextLayout={onTextLayoutChange}
                numberOfLines={idx === displayedFields.length - 1 ? 3 : 2}
                style={{
                  fontSize: 20,
                  lineHeight: 20,
                  fontFamily: Fonts.Medium,
                  width:
                    photo && idx === displayedFields.length - 1
                      ? '66.4%'
                      : '100%',
                }}
              >
                {f.value}
              </Text>
            </>
          ))}
        </View>
      </DocumentCardMedium>
      {photo && (
        <View
          style={{
            position: 'absolute',
            bottom: 27,
            right: 14,
            zIndex: 10,
          }}
        >
          <Image
            style={{
              width: 82,
              height: 82,
              borderRadius: 41,
            }}
            source={{ uri: photo }}
          />
        </View>
      )}
      {displayedHighlight && (
        <View
          style={{
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
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontFamily: Fonts.Regular,
              color: Colors.white90,
              width: photo ? '66.4%' : '100%',
            }}
          >
            {displayedHighlight.toUpperCase()}
          </Text>
        </View>
      )}
      {/* Dots - more action */}
      <TouchableOpacity
        onPress={onHandleMore}
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          top: 18,
          right: 17,
          zIndex: 100,
          paddingHorizontal: 3,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            zIndex: 1,
          }}
        >
          {[...Array(3).keys()].map((c) => (
            <View
              key={c}
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                marginHorizontal: 2,
                backgroundColor: Colors.black,
              }}
            />
          ))}
        </View>
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
  /**
   * logic to define if credential text should be scaled
   */
  const [isCredentialNameScaled, setIsCredentialNameScaled] = useState(false)
  const handleCredentialNameLayout = (e: TextLayoutEvent) => {
    if (!isCredentialNameScaled) {
      setIsCredentialNameScaled(e.nativeEvent.lines.length > 2)
    }
  }

  /**
   * Display credential type
   */
  const displayCredentialType = useMemo(() => {
    return getCredentialUIType(credentialType)
  }, [credentialType])

  /**
   * logic to define how many fields are displayed
   */
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
          if (lines.current > 7) {
            setDisplayedFields((prevState) =>
              prevState.slice(0, Math.floor(lines.current / fields.length)),
            )
          } else if (lines.current > 9) {
            setDisplayedFields((prevState) => prevState.slice(0, 3))
          }
        }
      }
    }
  }
  const onTextLayoutChange = handleOptionalFieldTextLayout()

  return (
    <View style={{ position: 'relative' }}>
      <OtherCardMedium>
        <View
          style={{
            paddingVertical: 16,
            paddingRight: 22,
            paddingLeft: 20,
            height: '100%',
          }}
        >
          <View style={{ flex: 0.29 }}>
            <Text
              style={{
                fontSize: 18,
                lineHeight: 18,
                letterSpacing: 0.09,
                color: Colors.jumbo,
                width: logo ? '70%' : '100%',
                fontFamily: Fonts.Regular,
              }}
            >
              {displayCredentialType}
            </Text>
            <Space height={13} />
            <Text
              // @ts-expect-error
              onTextLayout={handleCredentialNameLayout}
              numberOfLines={isCredentialNameScaled ? 2 : undefined}
              style={{
                fontSize: isCredentialNameScaled ? 22 : 28,
                lineHeight: isCredentialNameScaled ? 24 : 28,
                letterSpacing: 0.15,
                color: Colors.black80,
                fontFamily: Fonts.Regular,
                flexWrap: 'wrap',
                width: logo && !isCredentialNameScaled ? '70%' : '100%',
              }}
            >
              {credentialName}
            </Text>
          </View>
          <View style={{ flex: 0.71, paddingHorizontal: 10 }}>
            {displayedFields.map((f) => (
              <>
                <Space height={20} />
                {/* TODO: share the same with document card */}
                <Text
                  numberOfLines={1}
                  // @ts-expect-error
                  onTextLayout={onTextLayoutChange}
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.Regular,
                    color: Colors.slateGray,
                  }}
                >
                  {f.label}:
                </Text>
                <Space height={7} />
                <Text
                  numberOfLines={2}
                  // @ts-expect-error
                  onTextLayout={onTextLayoutChange}
                  style={{
                    fontSize: 20,
                    lineHeight: 20,
                    letterSpacing: 0.14,
                    fontFamily: Fonts.Medium,
                  }}
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
          style={{
            position: 'absolute',
            top: isCredentialNameScaled ? 14 : 16,
            right: isCredentialNameScaled ? 19 : 16,
          }}
        >
          <Image
            source={{ uri: logo }}
            style={{
              width: isCredentialNameScaled ? 37 : 78,
              height: isCredentialNameScaled ? 37 : 78,
              borderRadius: isCredentialNameScaled ? 37 / 2 : 78 / 2,
            }}
          />
        </View>
      )}
      {/* Dots - more action */}
      <TouchableOpacity
        onPress={onHandleMore}
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          bottom: 20,
          right: 24,
          zIndex: 100,
          paddingHorizontal: 3,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            zIndex: 1,
          }}
        >
          {[...Array(3).keys()].map((c) => (
            <View
              key={c}
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                marginHorizontal: 2,
                backgroundColor: Colors.black,
              }}
            />
          ))}
        </View>
      </TouchableOpacity>
    </View>
  )
}
