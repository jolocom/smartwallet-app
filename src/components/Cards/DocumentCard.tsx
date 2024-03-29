import React, { useCallback, useEffect, useState } from 'react'
import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { ScanDocumentIcon } from '~/assets/svg'
import { DocumentProperty } from '~/hooks/documents/types'
import { TextLayoutEvent } from '~/types/props'
import { Colors } from '~/utils/colors'
import {
  CardMoreBtn,
  DocumentFields,
  DocumentFooter,
  DocumentHeader,
  DocumentHolderName,
  DocumentPhoto,
  SecondaryField,
} from './components'
import {
  DOCUMENT_HEADER_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
  ORIGINAL_DOCUMENT_SCREEN_WIDTH,
} from './consts'
import { useCredentialNameScale } from './hooks'
import ScaledCard, { ScaledView } from './ScaledCard'
interface DocumentCardProps {
  id: string
  credentialName: string
  onPress?: () => void
  fields: Array<DocumentProperty>
  onHandleMore?: () => void
  holderName?: string
  photo?: string
  issuerIcon?: string
  icons?: string[]
  hasImageFields?: boolean
  backgroundImage?: string
  backgroundColor?: string
  style?: StyleProp<ViewStyle>
  expired?: boolean
  showMenu?: boolean
}

export const BORDER_RADIUS = 15

const DocumentCard: React.FC<DocumentCardProps> = React.memo<DocumentCardProps>(
  ({
    id,
    credentialName,
    fields,
    photo,
    onHandleMore,
    holderName,
    backgroundColor,
    backgroundImage,
    issuerIcon,
    hasImageFields = false,
    icons,
    style = {},
    onPress,
    expired = false,
    showMenu = false,
  }) => {
    const { isCredentialNameScaled } = useCredentialNameScale()

    const [holderNameLines, setHolderNameLines] = useState(0)

    const handleHolderNameTextLayout = (e: TextLayoutEvent) => {
      setHolderNameLines(e.nativeEvent.lines.length)
    }

    const handlePress = () => {
      if (onPress) {
        ReactNativeHapticFeedback.trigger('impactLight', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: true,
        })
        onPress && onPress()
      }
    }

    const checkLayoutCase = (...args: Boolean[]) => args.every(arg => arg)

    const isBackground = Boolean(backgroundImage || backgroundColor)

    const calculateMaxRows = useCallback(() => {
      const isHolderName = Boolean(holderName)
      const isFooterIcons = Boolean(hasImageFields || icons?.length)
      const isPhoto = Boolean(photo)
      const isNameOrPhoto = isPhoto || isHolderName

      if (checkLayoutCase(isBackground, isNameOrPhoto, isFooterIcons)) {
        return 2
      } else if (checkLayoutCase(isBackground, isNameOrPhoto, !isFooterIcons)) {
        return 3
      } else if (checkLayoutCase(isBackground, !isNameOrPhoto, isFooterIcons)) {
        return 3
      } else if (
        checkLayoutCase(isBackground, !isNameOrPhoto, !isFooterIcons)
      ) {
        return 4
      } else if (
        checkLayoutCase(!isBackground, !isNameOrPhoto, !isFooterIcons)
      ) {
        return 5
      } else if (
        checkLayoutCase(!isBackground, !isNameOrPhoto, isFooterIcons)
      ) {
        return 4
      } else if (
        checkLayoutCase(!isBackground, isNameOrPhoto, !isFooterIcons)
      ) {
        return 4
      } else if (checkLayoutCase(!isBackground, isNameOrPhoto, isFooterIcons)) {
        return 3
      } else {
        return 0
      }
    }, [holderName, backgroundColor, backgroundImage, holderNameLines])

    const maxRows = calculateMaxRows()

    const maxLinesPerField =
      isCredentialNameScaled && holderNameLines === 2 ? 4 : 5

    const scalingConfig = {
      originalHeight: ORIGINAL_DOCUMENT_CARD_HEIGHT,
      originalWidth: ORIGINAL_DOCUMENT_CARD_WIDTH,
      originalScreenWidth: ORIGINAL_DOCUMENT_SCREEN_WIDTH,
    }

    const getFieldsTopDistance = () => {
      let distance = 0
      if (photo) {
        distance += 4
      }
      if (!holderName && photo) {
        distance += isBackground ? 42 : 84
      } else if (holderName) {
        distance -= isBackground ? 2 : 8
      } else {
        distance += isBackground ? 8 : 2
      }
      return distance
    }

    // NOTE: Rendering secondaryField in case no holderName and background but a photo are available.If this is the case, the first field will be shifted from the array and passed down to DocumentFields accordingly. Rendering secondaryField instead of holderName to keep styling in place.
    const showSecondaryField = !holderName && !isBackground && photo

    const secondaryField = showSecondaryField && fields.shift()

    return (
      <>
        <ScaledCard
          originalHeight={scalingConfig.originalHeight}
          originalWidth={scalingConfig.originalWidth}
          originalScreenWidth={scalingConfig.originalScreenWidth}
          style={[
            Platform.OS === 'ios' ? styles.cardIos : styles.cardAndroid,
            style,
          ]}
          scaleStyle={styles.cardScaled}
          testID="documentCard"
        >
          <View style={[styles.contentContainer, expired && { opacity: 0.5 }]}>
            <DocumentHeader
              name={credentialName}
              icon={issuerIcon}
              backgroundImage={backgroundImage}
              backgroundColor={backgroundColor}
              truncateName={showMenu}
            />
            <View style={styles.content}>
              <ScaledView
                scaleStyle={
                  !isBackground && photo
                    ? {
                        height: holderName || showSecondaryField ? 90 : 21.5,
                        justifyContent: 'center',
                      }
                    : !isBackground && !photo && holderName
                    ? { marginBottom: 14 }
                    : {}
                }
              >
                {photo && (
                  <DocumentPhoto
                    photo={photo}
                    topPosition={backgroundImage || backgroundColor ? -42 : 0}
                  />
                )}
                {holderName && (
                  <DocumentHolderName
                    name={holderName}
                    cropName={!!photo}
                    onLayout={handleHolderNameTextLayout}
                  />
                )}
                {secondaryField && (
                  <SecondaryField
                    field={secondaryField}
                    labelScaledStyle={styles.fieldLabel}
                    valueScaledStyle={styles.fieldValue}
                  />
                )}
              </ScaledView>
              {isBackground && (
                <ScaledView
                  scaleStyle={{
                    paddingBottom: getFieldsTopDistance(),
                  }}
                />
              )}
              <DocumentFields
                fields={fields}
                maxLines={maxLinesPerField}
                maxRows={maxRows}
                rowDistance={14}
                labelScaledStyle={styles.fieldLabel}
                valueScaledStyle={styles.fieldValue}
              />
            </View>
            {/* The button has to be absolutely positioned b/c the Header is too large and takes up too much space.
              Also, the header shouln't be pressable due to additional behavior + the menu button. Finally, it has
              to be at the bottom so that it's rendered last, otherwise the press events don't propagate.
           */}
            <TouchableOpacity
              onPress={handlePress}
              activeOpacity={1}
              style={styles.btn}
            />
          </View>
          {showMenu && <CardMoreBtn onPress={onHandleMore} />}
          {Boolean(icons?.length || hasImageFields || expired) && (
            <DocumentFooter
              leftIcons={icons}
              expired={expired}
              renderRightIcon={
                hasImageFields ? () => <ScanDocumentIcon /> : undefined
              }
            />
          )}
        </ScaledCard>
      </>
    )
  },
  (prev, next) => {
    const relevantProps: Array<keyof DocumentCardProps> = ['id', 'showMenu']
    const arePropsEqual = relevantProps.every(prop => prev[prop] === next[prop])

    return arePropsEqual
  },
)

const styles = StyleSheet.create({
  btn: {
    ...StyleSheet.absoluteFillObject,
    top: DOCUMENT_HEADER_HEIGHT,
    flex: 1,
    zIndex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    lineHeight: 16,
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 20,
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  cardIos: {
    flex: 1,
    backgroundColor: Colors.white,
    shadowColor: Colors.mainBlack,
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  cardAndroid: {
    flex: 1,
    elevation: 10,
    backgroundColor: Colors.white,
  },
  cardScaled: {
    borderRadius: BORDER_RADIUS,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.success,
    borderRadius: BORDER_RADIUS,
  },
})

export default DocumentCard
