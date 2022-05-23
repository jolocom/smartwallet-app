import React, { useCallback, useState } from 'react'
import {
  StyleProp,
  TouchableOpacity,
  Vibration,
  View,
  ViewStyle,
} from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import ScaledCard, { ScaledView } from './ScaledCard'
import { useCredentialNameScale } from './hooks'
import {
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
  ORIGINAL_DOCUMENT_SCREEN_WIDTH,
} from './consts'
import {
  DocumentBackgroundColor,
  DocumentBackgroundImage,
  DocumentFields,
  DocumentFooter,
  DocumentHeader,
  DocumentHolderName,
  DocumentPhoto,
} from './components'
import { TextLayoutEvent } from '~/types/props'
import { Colors } from '~/utils/colors'
import { ScanDocumentIcon } from '~/assets/svg'

interface DocumentCardProps {
  credentialName: string
  onPress?: () => void
  fields: Array<DisplayVal>
  onHandleMore: () => void
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

  const calculateMaxRows = useCallback(() => {
    let maxRows = 4
    if (backgroundImage) {
      maxRows = maxRows - 2
    } else if (backgroundColor) {
      if (!holderName) maxRows--
      else maxRows = maxRows - 2
    }

    if (holderNameLines > 1 && backgroundImage) {
      maxRows--
    }

    if (!holderName && !backgroundImage) {
      maxRows++
    }

    return maxRows
  }, [holderName, backgroundColor, backgroundImage, holderNameLines])

  const maxRows = calculateMaxRows()
  const maxLinesPerField =
    isCredentialNameScaled && holderNameLines === 2 ? 4 : 5

  const scalingConfig = {
    originalHeight: ORIGINAL_DOCUMENT_CARD_HEIGHT,
    originalWidth: ORIGINAL_DOCUMENT_CARD_WIDTH,
    originalScreenWidth: ORIGINAL_DOCUMENT_SCREEN_WIDTH,
  }

  const renderBackground = useCallback(() => {
    if (backgroundImage) {
      return <DocumentBackgroundImage image={backgroundImage} />
    } else if (backgroundColor) {
      return <DocumentBackgroundColor color={backgroundColor} />
    } else {
      return <ScaledView scaleStyle={{ height: 24 }} />
    }
  }, [backgroundColor, backgroundImage])

  const isBackground = backgroundImage || backgroundColor

  const getPhotoPosition = () => {
    let verticalPosition = -30

    if (!isBackground) {
      verticalPosition = verticalPosition - 20
    }

    return verticalPosition
  }

  // NOTE: sor/ting the fields from shortest value to longest to fit more fields in the card.
  // Nevertheless, this leads to the "metadata" fields (i.e. issuer, expires, etc.) to be prioritized,
  // which is not desireable.

  //fields = fields.sort((prev, next) =>
  //  prev.value.length > next.value.length ? 1 : -1,
  //)

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
          />
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={1}
            style={{ flex: 1 }}
          >
            {renderBackground()}
            {photo && (
              <DocumentPhoto
                photo={photo}
                verticalPosition={getPhotoPosition()}
              />
            )}
            {holderName && (
              <DocumentHolderName
                name={holderName}
                cropName={!!photo}
                onLayout={handleHolderNameTextLayout}
              />
            )}
            <ScaledView scaleStyle={{ paddingBottom: holderName ? 16 : 56 }} />
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
