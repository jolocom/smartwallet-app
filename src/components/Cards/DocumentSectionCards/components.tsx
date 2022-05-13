import { DisplayVal } from '@jolocom/sdk/js/credentials'
import React from 'react'
import {
  Image,
  ImageBackground,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { TextLayoutEvent } from '~/types/props'

import { Colors } from '~/utils/colors'
import { debugView } from '~/utils/dev'
import { Fonts } from '~/utils/fonts'
import { useCredentialNameScale, usePruneFields } from '../hooks'
import { FieldsCalculator } from '../InteractionShare/components'
import { ScaledText, ScaledView } from '../ScaledCard'

interface Props {
  onPress: () => void
  positionStyles: Partial<Pick<ViewStyle, 'left' | 'right' | 'top' | 'bottom'>>
}

export const CardMoreBtn: React.FC<Props> = ({ onPress }) => (
  <ScaledView
    scaleStyle={styles.dotsContainerScaled}
    style={styles.dotsContainer}
  >
    <TouchableOpacity onPress={onPress} style={styles.dotsBtn}>
      {[...Array(3).keys()].map((c) => (
        <ScaledView key={c} scaleStyle={styles.dot} />
      ))}
    </TouchableOpacity>
  </ScaledView>
)

export const DocumentFooter: React.FC<{
  rightIcons?: string[]
  leftIcons?: string[]
  style?: StyleProp<ViewStyle>
}> = ({ rightIcons, leftIcons, style = {} }) => {
  //TODO use icons
  return (
    <ScaledView
      style={[styles.footerContainer, style]}
      scaleStyle={styles.footerContainerScaled}
    >
      <View style={styles.footerBorder} />
    </ScaledView>
  )
}

export const DocumentPhoto: React.FC<{ photo: string }> = ({ photo }) => (
  <ScaledView
    scaleStyle={styles.photoContainerScaled}
    style={styles.photoContainer}
  >
    <Image resizeMode="cover" style={styles.photo} source={{ uri: photo }} />
  </ScaledView>
)

export const DocumentHeader: React.FC<{
  name: string
  icon?: string
  onPressMenu: () => void
}> = ({ name, icon, onPressMenu }) => {
  const { handleCredentialNameTextLayout } = useCredentialNameScale()

  return (
    <View style={styles.headerContainer}>
      {icon && (
        <ScaledView
          scaleStyle={{
            width: 32,
            height: 32,
            marginRight: 10,
          }}
        >
          <Image
            resizeMode="cover"
            style={[styles.photo, { borderRadius: 4.2 }]}
            source={{ uri: icon }}
          />
        </ScaledView>
      )}
      <ScaledText
        // @ts-expect-error
        onTextLayout={handleCredentialNameTextLayout}
        numberOfLines={1}
        scaleStyle={styles.credentialName}
        style={[styles.mediumText, { flex: 1 }]}
      >
        {name}
      </ScaledText>
      <CardMoreBtn
        onPress={onPressMenu}
        positionStyles={{
          top: 18,
          right: 17,
        }}
      />
    </View>
  )
}

export const DocumentHolderName: React.FC<{
  name: string
  onLayout: (e: TextLayoutEvent) => void
}> = ({ name, onLayout }) => {
  return (
    <ScaledView
      scaleStyle={{
        paddingLeft: 24,
      }}
    >
      <ScaledText
        // @ts-expect-error
        onTextLayout={onLayout}
        numberOfLines={2}
        style={styles.mediumText}
        scaleStyle={styles.holderName}
      >
        {name}
      </ScaledText>
    </ScaledView>
  )
}

export const DocumentFields: React.FC<{
  fields: Required<DisplayVal>[]
  maxFields: number
  maxLines: number
}> = ({ fields, maxLines, maxFields }) => {
  const {
    displayedFields,
    handleFieldValueLayout,
    handleFieldValuesVisibility,
  } = usePruneFields(fields, maxFields, maxLines)

  return (
    <View style={{ paddingLeft: 24 }}>
      <FieldsCalculator cbFieldsVisibility={handleFieldValuesVisibility}>
        {displayedFields.map((f, idx) => (
          <React.Fragment key={f.key}>
            {idx !== 0 && <ScaledView scaleStyle={{ paddingBottom: 14 }} />}
            <ScaledText
              numberOfLines={1}
              style={[
                styles.regularText,
                {
                  width: '100%',
                },
              ]}
              scaleStyle={styles.fieldLabel}
            >
              {f.label.trim()}:
            </ScaledText>
            <ScaledView scaleStyle={{ paddingBottom: 6 }} />
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
                  width: '100%',
                },
              ]}
            >
              {f.value}
            </ScaledText>
          </React.Fragment>
        ))}
      </FieldsCalculator>
    </View>
  )
}

const BackgroundOpacity = () => (
  <LinearGradient
    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
    style={{ flex: 1 }}
  />
)

export const DocumentBackgroundImage: React.FC<{ image: string }> = ({
  image,
}) => (
  <ScaledView scaleStyle={{ height: 112 }} style={{ width: '100%' }}>
    <ImageBackground
      style={{ width: '100%', height: '100%' }}
      source={{ uri: image }}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        style={{ flex: 1 }}
      />
    </ImageBackground>
  </ScaledView>
)

export const DocumentBackgroundColor: React.FC<{ color: string }> = ({
  color,
}) => (
  <View style={{ height: 84, width: '100%', backgroundColor: color }}>
    <LinearGradient
      colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
      style={{ flex: 1 }}
    />
  </View>
)

const styles = StyleSheet.create({
  dotsContainerScaled: {
    paddingVertical: 3,
    width: 24,
    height: 24,
  },
  dotsContainer: {
    //position: 'absolute',
    //zIndex: 100,
    height: '100%',
  },
  dotsBtn: {
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexDirection: 'column',
    paddingHorizontal: 10,
    flex: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
    backgroundColor: Colors.black,
  },
  credentialName: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '500',
  },
  holderName: {
    fontSize: 24,
    lineHeight: 28,
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
  headerContainer: {
    height: 68,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  footerContainerScaled: {
    height: 60,
    paddingHorizontal: 20,
  },
  footerContainer: {
    width: '100%',
    zIndex: 9,
  },
  footerBorder: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#D8D8D8',
  },
  regularText: {
    fontFamily: Fonts.Regular,
    fontSize: 22,
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
