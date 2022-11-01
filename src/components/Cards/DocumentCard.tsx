import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  Animated,
  Easing,
} from 'react-native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

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
  highlight?: boolean
}

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
    highlight,
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

    const checkLayoutCase = (...args: Boolean[]) => args.every((arg) => arg)

    const calculateMaxRows = useCallback(() => {
      const isBackgroundImage = Boolean(backgroundImage)
      const isBackgroundColor = Boolean(backgroundColor) && !isBackgroundImage
      const isHolderName = Boolean(holderName)
      const isFooterIcons = Boolean(hasImageFields || icons?.length)

      if (
        checkLayoutCase(
          isBackgroundImage || isBackgroundColor,
          isHolderName,
          !isFooterIcons,
        )
      ) {
        return 3
      } else if (
        checkLayoutCase(isBackgroundImage || isBackgroundColor, isHolderName)
      ) {
        return 2
      } else if (
        checkLayoutCase(!isBackgroundColor, !isBackgroundImage, !isFooterIcons)
      ) {
        return 4
      } else if (
        checkLayoutCase(!isBackgroundColor, !isBackgroundImage, isHolderName)
      ) {
        return 3
      } else if (
        checkLayoutCase(isBackgroundColor || isBackgroundImage, !isHolderName)
      ) {
        return isFooterIcons ? 2 : 3
      } else if (
        checkLayoutCase(!isBackgroundColor, !isBackgroundImage, !isHolderName)
      ) {
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

    const isBackground = Boolean(backgroundImage || backgroundColor)

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

    const FadeOutView = () => {
      const opacity = useRef(new Animated.Value(0)).current

      const animateView = (
        animatedRef: Animated.Value,
        toValue: number,
        duration: number,
        delay: number,
      ) => {
        return Animated.timing(animatedRef, {
          toValue,
          duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
          delay,
        })
      }

      useEffect(() => {
        Animated.sequence([
          animateView(opacity, 0.5, 300, 1000),
          animateView(opacity, 0, 200, 3000),
        ]).start()
      }, [highlight])

      return <Animated.View style={{ ...styles.overlay, opacity: opacity }} />
    }

    return (
      <>
        <ScaledCard
          originalHeight={scalingConfig.originalHeight}
          originalWidth={scalingConfig.originalWidth}
          originalScreenWidth={scalingConfig.originalScreenWidth}
          style={[styles.card, style]}
          scaleStyle={styles.cardScaled}
          testID="documentCard"
        >
          {highlight && <FadeOutView />}
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
    const arePropsEqual = relevantProps.every(
      (prop) => prev[prop] === next[prop],
    )

    return arePropsEqual
  },
)

const styles = StyleSheet.create({
  btn: {
    ...StyleSheet.absoluteFillObject,
    top: DOCUMENT_HEADER_HEIGHT,
    flex: 1,
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
  card: {
    overflow: 'hidden',
    flex: 1,
    backgroundColor: Colors.white,
  },
  cardScaled: {
    borderRadius: 15,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgb(113, 114, 254)',
    zIndex: 1,
    borderRadius: 15,
  },
})

export default DocumentCard
