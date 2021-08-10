import React, { useMemo } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import OtherCardMedium from '~/assets/svg/OtherCardMedium'
import { Fonts } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { getCredentialUIType } from '~/hooks/signedCredentials/utils'
import { useCredentialNameScale, useTrimFields } from '../hooks'
import ScaledCard, { ScaledText, ScaledView } from '../ScaledCard'
import {
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
  ORIGINAL_DOCUMENT_SCREEN_WIDTH,
} from './consts'
import { CardMoreBtn } from './components'
import { OtherCardProps } from './types'

const DocumentSectionOtherCard: React.FC<OtherCardProps> = ({
  credentialType,
  credentialName,
  fields,
  logo,
  onHandleMore,
}) => {
  const { isCredentialNameScaled, handleCredentialNameTextLayout } =
    useCredentialNameScale()

  const { displayedFields, onTextLayoutChange } = useTrimFields(fields, logo)

  return (
    <ScaledCard
      originalHeight={ORIGINAL_DOCUMENT_CARD_HEIGHT}
      originalWidth={ORIGINAL_DOCUMENT_CARD_WIDTH}
      originalScreenWidth={ORIGINAL_DOCUMENT_SCREEN_WIDTH}
      style={{ position: 'relative' }}
      testID="otherCard"
    >
      <OtherCardMedium>
        <ScaledView scaleStyle={styles.otherBodyContainer}>
          <View style={{ flex: 0.29 }}>
            <ScaledText
              numberOfLines={1}
              scaleStyle={styles.otherCredentialType}
              style={[
                styles.regularText,
                {
                  width: logo ? '70%' : '100%',
                },
              ]}
            >
              {credentialType}
            </ScaledText>
            <ScaledView scaleStyle={{ paddingBottom: 13 }} />
            <ScaledText
              // @ts-expect-error
              onTextLayout={handleCredentialNameTextLayout}
              numberOfLines={isCredentialNameScaled ? 2 : undefined}
              scaleStyle={[
                isCredentialNameScaled
                  ? styles.otherCredentialNameScaled
                  : styles.otherCredentialName,
                {
                  letterSpacing: 0.15,
                },
              ]}
              style={[
                styles.regularText,
                {
                  color: Colors.black80,
                  flexWrap: 'wrap',
                  width: logo && !isCredentialNameScaled ? '70%' : '100%',
                },
              ]}
            >
              {credentialName}
            </ScaledText>
          </View>
          <ScaledView
            scaleStyle={{ paddingHorizontal: 10 }}
            style={{ flex: 0.71 }}
          >
            {displayedFields.map((f) => (
              <>
                <ScaledView scaleStyle={{ paddingBottom: 20 }} />
                {/* TODO: share the same with document card */}
                <ScaledText
                  numberOfLines={1}
                  // @ts-expect-error
                  onTextLayout={onTextLayoutChange}
                  scaleStyle={styles.fieldLabel}
                  style={styles.regularText}
                >
                  {f.label}:
                </ScaledText>
                <ScaledView scaleStyle={{ paddingBottom: 7 }} />
                <ScaledText
                  numberOfLines={2}
                  // @ts-expect-error
                  onTextLayout={onTextLayoutChange}
                  scaleStyle={styles.fieldText}
                  style={styles.mediumText}
                >
                  {f.value}
                </ScaledText>
              </>
            ))}
          </ScaledView>
        </ScaledView>
      </OtherCardMedium>
      {logo && (
        <ScaledView
          scaleStyle={
            isCredentialNameScaled
              ? styles.otherLogoContainerScaled
              : styles.otherLogoContainer
          }
          style={styles.logoContainerDefault}
        >
          <Image source={{ uri: logo }} style={styles.image} />
        </ScaledView>
      )}
      {/* Dots - more action */}
      <CardMoreBtn
        onPress={onHandleMore}
        positionStyles={{
          bottom: 20,
          right: 24,
        }}
      />
    </ScaledCard>
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
  logoContainerDefault: {
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 10,
    borderRadius: 40,
  },
  otherLogoContainer: {
    top: 16,
    right: 16,
    width: 78,
    height: 78,
  },
  otherLogoContainerScaled: {
    top: 14,
    right: 19,
    width: 37,
    height: 37,
  },
  image: {
    width: '100%',
    height: '100%',
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

export default DocumentSectionOtherCard
