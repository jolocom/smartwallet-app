import React, { useCallback, useState } from 'react'
import {
  Platform,
  StyleProp,
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
      style={[
        {
          overflow: 'hidden',
          flex: 1,
          backgroundColor: Colors.white,
        },
        style,
      ]}
      scaleStyle={{ borderRadius: 15 }}
      testID="documentCard"
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <DocumentHeader
            name={credentialName}
            icon={issuerIcon}
            onPressMenu={onHandleMore}
            backgroundImage={backgroundImage}
            backgroundColor={backgroundColor}
          />
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={1}
            style={{ flex: 1, marginTop: 12 }}
          >
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
            <ScaledView
              scaleStyle={{ paddingBottom: getFieldsTopDistance() }}
            />
            <DocumentFields
              fields={fields}
              maxLines={maxLinesPerField}
              maxRows={maxRows}
              rowDistance={14}
              labelScaledStyle={{
                fontSize: 16,
                lineHeight: 16,
                marginBottom: 6,
              }}
              valueScaledStyle={{
                fontSize: 20,
                lineHeight: 20,
              }}
            />
          </TouchableOpacity>
        </View>
        <DocumentFooter
          leftIcons={icons}
          renderRightIcon={
            hasImageFields ? () => <ScanDocumentIcon /> : undefined
          }
        />
      </View>
    </ScaledCard>
  )
}

export default DocumentCard
