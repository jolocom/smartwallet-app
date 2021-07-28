import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import { Fonts } from '~/utils/fonts'
import Space from '../Space'
import { Colors } from '~/utils/colors'
import { useState } from 'react'
import { TextLayoutEvent } from '../Card/Field'

type CredentialDocumentCardProps = {
  credentialName: string
  holderName: string
  fields: Array<Required<DisplayVal>>
  highlight?: string
  photo?: string
  onHandleMore: () => void // id is required here, to be able to delete a credential
}

/**
 * TODO:
 * - if given name or family name is not provided it displays 'not specified'
 * - trim highlight
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
  const handleHeaderTextLayout = (e: TextLayoutEvent) => {
    if (!isCredentialNameScaled) {
      setIsCredentialNameScaled(e.nativeEvent.lines.length > 2)
    }
  }

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
              onTextLayout={handleHeaderTextLayout}
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
          {fields.map((f, idx) => (
            <>
              {idx !== 0 && <Space height={14} />}
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 16,
                  fontFamily: Fonts.Regular,
                  color: Colors.slateGray,
                }}
              >
                {f.label}
              </Text>
              <Space height={9} />
              <Text
                style={{
                  fontSize: 20,
                  lineHeight: 20,
                  fontFamily: Fonts.Medium,
                  width: photo && idx === fields.length - 1 ? '66.4%' : '100%',
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
      {highlight && (
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
            {highlight.toUpperCase()}
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
