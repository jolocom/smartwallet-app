import React, { useCallback, useState } from 'react'
import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import { ScanDocumentIcon } from '~/assets/svg'
import { DocumentProperty } from '~/hooks/documents/types'
import { TextLayoutEvent } from '~/types/props'
import { Colors } from '~/utils/colors'
import {
  DocumentFields,
  DocumentFooter,
  DocumentHeader,
  DocumentHolderName,
  DocumentPhoto,
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
}

const DocumentCard: React.FC<DocumentCardProps> = ({
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

    if (checkLayoutCase(isBackgroundImage || isBackgroundColor, isHolderName)) {
      return 2
    } else if (
      checkLayoutCase(!isBackgroundColor, !isBackgroundImage, isHolderName)
    ) {
      return 3
    } else if (
      checkLayoutCase(isBackgroundColor || isBackgroundImage, !isHolderName)
    ) {
      return 3
    } else if (
      checkLayoutCase(!isBackgroundColor, !isBackgroundImage, !isHolderName)
    ) {
      return 4
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

  const getSubheaderStyles = (): ViewStyle | undefined => {
    if (checkLayoutCase(isBackground)) {
      return {
        marginTop: -30,
        justifyContent: 'flex-end',
      }
    } else if (checkLayoutCase(!isBackground)) {
      return {
        marginTop: 12,
        justifyContent: 'center',
      }
    }
  }

  const getFieldsTopDistance = () => {
    let distance = 0

    if (photo) {
      distance = distance + 12
    }

    if (!holderName && photo) {
      distance = distance + 42
    } else if (holderName) {
      distance = distance + 16
    }

    // FIXME: with backgroundColor, the fields are a bit too low
    if (isBackground && Platform.OS === 'android') {
      distance = distance - 12
    }

    return distance
  }

  return (
    <ScaledCard
      originalHeight={scalingConfig.originalHeight}
      originalWidth={scalingConfig.originalWidth}
      originalScreenWidth={scalingConfig.originalScreenWidth}
      style={[styles.card, style]}
      scaleStyle={styles.cardScaled}
      testID="documentCard"
    >
      <View style={styles.contentContainer}>
        <DocumentHeader
          name={credentialName}
          icon={issuerIcon}
          onPressMenu={onHandleMore}
          backgroundImage={backgroundImage}
          backgroundColor={backgroundColor}
        />
        <View style={styles.content}>
          <ScaledView scaleStyle={[getSubheaderStyles()]}>
            {photo && <DocumentPhoto photo={photo} />}
            {holderName && (
              <DocumentHolderName
                name={holderName}
                cropName={!!photo}
                onLayout={handleHolderNameTextLayout}
              />
            )}
          </ScaledView>
          <ScaledView scaleStyle={{ paddingBottom: getFieldsTopDistance() }} />
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
      <DocumentFooter
        leftIcons={icons}
        renderRightIcon={
          hasImageFields ? () => <ScanDocumentIcon /> : undefined
        }
      />
    </ScaledCard>
  )
}

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
    marginTop: 12,
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
})

export default DocumentCard
