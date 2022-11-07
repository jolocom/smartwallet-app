import React, { ReactNode, useEffect, useState } from 'react'
import {
  Image,
  ImageBackground,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { FavoriteHeartIcon, PurpleTickSuccess } from '~/assets/svg'
import { DocumentProperty } from '~/hooks/documents/types'
import useImagePrefetch from '~/hooks/useImagePrefetch'
import useTranslation from '~/hooks/useTranslation'
import { TextLayoutEvent } from '~/types/props'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'
import JoloText from '../JoloText'
import { DOCUMENT_HEADER_HEIGHT } from './consts'
import { useCredentialNameScale, usePruneFields } from './hooks'
import { ScaledText, ScaledView } from './ScaledCard'
import { splitIntoRows } from './utils'
import FastImage from 'react-native-fast-image'

export const FieldsCalculator: React.FC<{
  cbFieldsVisibility: (child: ReactNode, idx: number) => ReactNode
}> = ({ children, cbFieldsVisibility }) =>
  React.Children.map(children, cbFieldsVisibility) as React.ReactElement<
    unknown,
    string
  > | null

export const CardMoreBtn: React.FC<{
  onPress?: () => void
}> = ({ onPress }) => (
  <ScaledView
    scaleStyle={styles.dotsContainerScaled}
    style={styles.dotsContainer}
  >
    <TouchableOpacity onPress={onPress} style={styles.dotsBtn}>
      <ScaledView scaleStyle={styles.scaledDots}>
        {[...Array(3).keys()].map((c) => (
          <ScaledView key={c} scaleStyle={styles.dot} />
        ))}
      </ScaledView>
    </TouchableOpacity>
  </ScaledView>
)

export const DocumentFooter: React.FC<{
  leftIcons?: string[]
  renderRightIcon?: () => JSX.Element
  expired?: boolean
  style?: StyleProp<ViewStyle>
}> = ({ renderRightIcon, leftIcons, style = {}, expired = false }) => {
  const { t } = useTranslation()

  return (
    <ScaledView
      style={[styles.footerContainer, style]}
      scaleStyle={styles.footerContainerScaled}
    >
      <View style={styles.footerBorder} />
      <View style={styles.footerContent}>
        {expired ? (
          <View style={styles.footerExpiredContainer}>
            <JoloText
              customStyles={{ fontFamily: Fonts.Medium }}
              color={Colors.mainBlack}
            >
              {t('DocumentCard.expired')}
            </JoloText>
          </View>
        ) : (
          <>
            <View style={styles.footerIconsContainer}>
              {leftIcons &&
                leftIcons.map((icon, i) => (
                  <ScaledView
                    key={i}
                    scaleStyle={{ width: 30, height: 30 }}
                    style={{ marginRight: 10 }}
                  >
                    <FastImage
                      source={{
                        uri: icon,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 4.2,
                      }}
                    />
                  </ScaledView>
                ))}
            </View>
            <View>{renderRightIcon && renderRightIcon()}</View>
          </>
        )}
      </View>
    </ScaledView>
  )
}

export const DocumentPhoto: React.FC<{
  photo: string
  topPosition?: number
}> = ({ photo, topPosition = 0 }) => (
  <ScaledView
    scaleStyle={[styles.photoContainerScaled, { top: topPosition }]}
    style={styles.photoContainer}
  >
    <Image resizeMode="cover" style={styles.photo} source={{ uri: photo }} />
  </ScaledView>
)

export const DocumentHeader: React.FC<{
  name: string
  icon?: string
  selected?: boolean
  backgroundImage?: string
  backgroundColor?: string
  truncateName?: boolean
  isInteracting?: boolean
}> = ({
  name,
  icon,
  selected,
  backgroundColor,
  backgroundImage,
  truncateName,
  isInteracting,
}) => {
  const { handleCredentialNameTextLayout } = useCredentialNameScale()

  const prefetchedIcon = useImagePrefetch(icon)

  const renderBackground = (children: () => React.ReactChild) => {
    if (backgroundImage) {
      return (
        <DocumentBackgroundImage
          image={backgroundImage}
          isInteracting={isInteracting}
        >
          {children()}
        </DocumentBackgroundImage>
      )
    } else if (backgroundColor) {
      return (
        <DocumentBackgroundColor
          color={backgroundColor}
          isInteracting={isInteracting}
        >
          {children()}
        </DocumentBackgroundColor>
      )
    } else {
      return <GradientSeparator>{children()}</GradientSeparator>
    }
  }

  return (
    <View>
      {renderBackground(() => (
        <ScaledView
          scaleStyle={{
            height: DOCUMENT_HEADER_HEIGHT,
            padding: 16,
          }}
          style={styles.headerContainer}
        >
          {prefetchedIcon && (
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
                source={{ uri: prefetchedIcon }}
              />
            </ScaledView>
          )}
          <ScaledView
            scaleStyle={styles.credentialName}
            style={{ flex: 1, flexDirection: 'row' }}
          >
            <ScaledText
              // @ts-expect-error
              onTextLayout={handleCredentialNameTextLayout}
              numberOfLines={1}
              scaleStyle={styles.credentialName}
              style={{
                ...styles.mediumText,
                paddingRight: truncateName ? 24 : 0,
              }}
            >
              {name}
            </ScaledText>
            <View style={{ flex: 1 }} />
          </ScaledView>
          {typeof selected !== 'undefined' && (
            <SelectedToggle selected={selected} />
          )}
        </ScaledView>
      ))}
    </View>
  )
}

export const DocumentHolderName: React.FC<{
  name: string
  onLayout?: (e: TextLayoutEvent) => void
  cropName?: boolean
  numberOfLines?: number
}> = ({ name, onLayout, cropName = false, numberOfLines = 2 }) => {
  const [renderedLines, setRenderedLines] = useState<number>()

  const handleLayout = (e: TextLayoutEvent) => {
    if (!renderedLines) {
      const lines = e.nativeEvent.lines.length
      setRenderedLines(lines)
    }
    onLayout && onLayout(e)
  }

  return (
    <ScaledView
      scaleStyle={{
        paddingLeft: 24,
        marginRight: cropName ? 116 : 0,
        marginVertical: 8,
      }}
    >
      <ScaledText
        // @ts-expect-error
        onTextLayout={handleLayout}
        numberOfLines={numberOfLines}
        scaleStyle={
          renderedLines === 1 ? styles.holderName : styles.holderNameSmall
        }
        style={styles.mediumText}
      >
        {name}
      </ScaledText>
    </ScaledView>
  )
}

export const DocumentFields: React.FC<{
  // NOTE: fields to be (potentially) displayed on the card
  fields: DocumentProperty[]
  // NOTE: (scaled) styles for the field label
  labelScaledStyle: TextStyle
  // NOTE: (scaled) styles for the field value
  valueScaledStyle: TextStyle
  // NOTE: max number of lines to be displayed per field
  maxLines: number
  // NOTE: max number of rows that can be displayed
  maxRows: number
  // NOTE: distance between lines
  rowDistance?: number
  // NOTE: number of characters to allow a field value to be displayed in a single line
  fieldCharacterLimit?: number
  // NOTE: number of columns to render the fields in
  nrOfColumns?: number
  // NOTE: allow fields taking up available space if possible
  allowOverflowingFields?: boolean
  // NOTE: called after calculating the fields that will be displayed
  onFinishCalculation?: (displayedFields: DocumentProperty[]) => void
  // NOTE: allow extra fields next to the photo if no holderName is present
  shoudIsolateFirstRow?: boolean
  // NOTE: hideFieldValues is only relevant for the OfferCard Component to display the placeholders
  hideFieldValues?: boolean
}> = ({
  fields,
  maxLines,
  maxRows,
  rowDistance = 0,
  fieldCharacterLimit = 14,
  valueScaledStyle,
  labelScaledStyle,
  nrOfColumns = 2,
  onFinishCalculation,
  allowOverflowingFields = true,
  hideFieldValues = false,
}) => {
  const maxFields = maxRows * 2
  const { displayedFields, handleFieldValuesVisibility } = usePruneFields(
    fields,
    maxFields,
    maxLines,
  )

  let rows = splitIntoRows(displayedFields, fieldCharacterLimit, nrOfColumns)
  // NOTE: since when splitting we may get more rows than @maxRows due to the value overflowing,
  // we have to cut it to the max nr of rows.

  rows = rows.splice(0, maxRows)

  useEffect(() => {
    const fields = rows.reduce<DocumentProperty[]>((acc, row) => {
      acc = [...acc, ...row]

      return acc
    }, [])

    onFinishCalculation && onFinishCalculation(fields)
  }, [rows])

  const renderField = (field: DocumentProperty) => {
    return (
      <ScaledView
        key={field.key}
        style={{ flex: 1 }}
        scaleStyle={{
          paddingRight: 12,
        }}
      >
        <ScaledText
          numberOfLines={1}
          style={[
            styles.regularText,
            {
              width: '100%',
            },
          ]}
          scaleStyle={[styles.fieldLabel, labelScaledStyle]}
        >
          {field?.label?.trim()}:
        </ScaledText>
        {hideFieldValues ? (
          <ScaledView scaleStyle={valueScaledStyle} />
        ) : (
          <ScaledText
            numberOfLines={1}
            scaleStyle={[styles.fieldText, valueScaledStyle]}
            style={[
              styles.mediumText,
              {
                width: '100%',
              },
            ]}
          >
            {field?.value}
          </ScaledText>
        )}
      </ScaledView>
    )
  }

  return (
    <ScaledView
      scaleStyle={{
        paddingLeft: 24,
      }}
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <FieldsCalculator cbFieldsVisibility={handleFieldValuesVisibility}>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-start',
          }}
        >
          {rows.map((row, idx) => (
            <ScaledView
              key={idx}
              style={{
                flexDirection: 'row',
              }}
              scaleStyle={{
                marginTop: idx === 0 ? 0 : rowDistance,
              }}
            >
              {row.map(renderField)}
              {!allowOverflowingFields && row.length % 2 === 1 && (
                <View style={{ flex: 1 }} />
              )}
            </ScaledView>
          ))}
        </View>
      </FieldsCalculator>
    </ScaledView>
  )
}

export const SecondaryField: React.FC<{
  field: DocumentProperty
  labelScaledStyle: TextStyle
  valueScaledStyle: TextStyle
}> = ({ field, labelScaledStyle, valueScaledStyle }) => (
  <ScaledView
    key={field.key}
    style={{ flex: 1 }}
    scaleStyle={{
      paddingRight: 12,
      justifyContent: 'center',
      paddingHorizontal: 24,
      maxWidth: '65%',
    }}
  >
    <ScaledText
      numberOfLines={1}
      style={[
        styles.regularText,
        {
          width: '100%',
        },
      ]}
      scaleStyle={[styles.fieldLabel, labelScaledStyle]}
    >
      {field?.label?.trim()}:
    </ScaledText>
    <ScaledText
      numberOfLines={2}
      scaleStyle={[styles.fieldText, valueScaledStyle]}
      style={[
        styles.mediumText,
        {
          width: '100%',
        },
      ]}
    >
      {field?.value}
    </ScaledText>
  </ScaledView>
)

const BackgroundOpacity: React.FC = ({ children }) => (
  <LinearGradient
    colors={[Colors.randomGrey, Colors.white00]}
    style={{ flex: 1 }}
  >
    {children}
  </LinearGradient>
)

export const GradientSeparator: React.FC = ({ children }) => {
  return (
    <ScaledView scaleStyle={{ height: DOCUMENT_HEADER_HEIGHT }}>
      <LinearGradient
        colors={[Colors.randomGrey, Colors.white]}
        style={{ flex: 1 }}
      >
        {children}
      </LinearGradient>
    </ScaledView>
  )
}

export const DocumentBackgroundImage: React.FC<{
  image: string
  isInteracting?: boolean
}> = ({ image, children, isInteracting }) => (
  <ScaledView
    scaleStyle={{ height: isInteracting ? 84 : 84 + DOCUMENT_HEADER_HEIGHT }}
    style={{ width: '100%' }}
  >
    <ImageBackground
      style={{ width: '100%', height: '100%' }}
      source={{ uri: image }}
    >
      <BackgroundOpacity>{children}</BackgroundOpacity>
    </ImageBackground>
  </ScaledView>
)

export const DocumentBackgroundColor: React.FC<{
  color: string
  isInteracting?: boolean
}> = ({ color, children, isInteracting }) => (
  <ScaledView
    scaleStyle={{
      height: isInteracting ? 84 : 84 + DOCUMENT_HEADER_HEIGHT,
    }}
    style={{
      width: '100%',
      backgroundColor: color,
    }}
  >
    <BackgroundOpacity>{children}</BackgroundOpacity>
  </ScaledView>
)

export const SelectedToggle: React.FC<{ selected: boolean }> = ({
  selected,
}) => {
  return (
    <ScaledView scaleStyle={styles.selectIndicator}>
      {selected ? (
        <PurpleTickSuccess />
      ) : (
        <ScaledView
          scaleStyle={styles.notSelectedScale}
          style={styles.notSelected}
        />
      )}
    </ScaledView>
  )
}

export const CardFavorite = () => (
  <View style={styles.favoriteContainer}>
    <FavoriteHeartIcon />
  </View>
)

const styles = StyleSheet.create({
  favoriteContainer: {
    position: 'absolute',
    top: -10,
    right: 6,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  dotsContainerScaled: {
    top: 18,
    right: 18,
    paddingVertical: 3,
    width: 20,
    height: 30,
  },
  dotsContainer: {
    justifyContent: 'center',
    zIndex: 99,
    position: 'absolute',
    height: '100%',
    borderRadius: 8,
  },
  scaledDots: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingVertical: 2,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  dotsBtn: {
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
    paddingHorizontal: 2,
  },
  holderName: {
    fontSize: 24,
    lineHeight: 28,
  },
  holderNameSmall: {
    fontSize: 22,
    lineHeight: 26,
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
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
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
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  footerExpiredContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.yellow,
    borderRadius: 9,
  },
  footerIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  selectIndicator: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  notSelected: {
    borderColor: Colors.black,
    opacity: 0.3,
  },
  notSelectedScale: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
})
