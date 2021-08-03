import React, { useMemo } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

import OtherCardMedium from '~/assets/svg/OtherCardMedium'
import { Fonts } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { getCredentialUIType } from '~/hooks/signedCredentials/utils'
import { useCredentialNameScale, useTrimFields } from '../hooks'

type OtherCardProps = {
  credentialType: string
  credentialName: string
  fields: Array<Required<DisplayVal>>
  logo?: string
  onHandleMore: (id: string) => void // id is required here, to be able to delete a credential
}

const OtherCard: React.FC<OtherCardProps> = ({
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
  const displayCredentialType = useMemo(
    () => getCredentialUIType(credentialType),
    [credentialType],
  )

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

export default OtherCard
