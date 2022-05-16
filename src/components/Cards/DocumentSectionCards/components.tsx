import { DisplayVal } from '@jolocom/sdk/js/credentials'
import _ from 'lodash'
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
import { splitFields, splitIntoRows } from './utils'

export const CardMoreBtn: React.FC<{
  onPress: () => void
  positionStyles: Partial<Pick<ViewStyle, 'left' | 'right' | 'top' | 'bottom'>>
}> = ({ onPress }) => (
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
  leftIcons?: string[]
  renderRightIcon?: () => JSX.Element
  style?: StyleProp<ViewStyle>
}> = ({ renderRightIcon, leftIcons, style = {} }) => {
  return (
    <ScaledView
      style={[styles.footerContainer, style]}
      scaleStyle={styles.footerContainerScaled}
    >
      <View style={styles.footerBorder} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          {leftIcons &&
            leftIcons.map((icon, i) => (
              <ScaledView
                key={i}
                scaleStyle={{ width: 40, height: 30 }}
                style={{ marginRight: 10 }}
              >
                <Image
                  source={{ uri: icon }}
                  resizeMode="cover"
                  style={{ width: '100%', height: '100%', borderRadius: 4.2 }}
                />
              </ScaledView>
            ))}
        </View>
        <View>{renderRightIcon && renderRightIcon()}</View>
      </View>
    </ScaledView>
  )
}

export const DocumentPhoto: React.FC<{
  photo: string
  verticalPosition?: number
}> = ({ photo, verticalPosition = -30 }) => (
  <View>
    <ScaledView
      scaleStyle={[styles.photoContainerScaled, { bottom: verticalPosition }]}
      style={styles.photoContainer}
    >
      <Image resizeMode="cover" style={styles.photo} source={{ uri: photo }} />
    </ScaledView>
  </View>
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
  cropName?: boolean
}> = ({ name, onLayout, cropName = false }) => {
  return (
    <ScaledView
      scaleStyle={{
        paddingLeft: 24,
        marginRight: cropName ? 116 : 0,
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
  maxLines: number
  maxRows: number
}> = ({ fields, maxLines, maxRows }) => {
  const maxFields = maxRows * 2
  const {
    displayedFields,
    handleFieldValueLayout,
    handleFieldValuesVisibility,
  } = usePruneFields(fields, maxFields, maxLines)

  const renderField = (field: Required<DisplayVal>, idx: number) => {
    return (
      <View key={field.key} style={{ flex: 1 }}>
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
          {field.label.trim()}:
        </ScaledText>
        <ScaledView scaleStyle={{ paddingBottom: 6 }} />
        <ScaledText
          numberOfLines={1}
          //@ts-expect-error
          onTextLayout={(e: TextLayoutEvent) => handleFieldValueLayout(e, idx)}
          scaleStyle={styles.fieldText}
          style={[
            styles.mediumText,
            {
              width: '100%',
            },
          ]}
        >
          {field.value}
        </ScaledText>
      </View>
    )
  }

  let rows = splitIntoRows(displayedFields)
  // NOTE: since when splitting we may get more rows than @maxRows due to the value overflowing,
  // we have to cut it to the max nr of rows.
  rows = rows.splice(0, maxRows)

  return (
    <ScaledView
      scaleStyle={{
        paddingHorizontal: 24,
      }}
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <FieldsCalculator cbFieldsVisibility={handleFieldValuesVisibility}>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          {rows.map((row, idx) => (
            <View
              key={idx}
              style={{ flexDirection: 'row', marginTop: idx === 0 ? 0 : 14 }}
            >
              {row.map((field, idx) => renderField(field, idx))}
            </View>
          ))}
        </View>
      </FieldsCalculator>
    </ScaledView>
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
      <BackgroundOpacity />
    </ImageBackground>
  </ScaledView>
)

export const DocumentBackgroundColor: React.FC<{ color: string }> = ({
  color,
}) => (
  <View style={{ height: 84, width: '100%', backgroundColor: color }}>
    <BackgroundOpacity />
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
