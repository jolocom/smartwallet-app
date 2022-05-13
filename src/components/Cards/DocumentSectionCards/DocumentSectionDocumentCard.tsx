import React, { useCallback, useState } from 'react'
import { View } from 'react-native'

import ScaledCard, { ScaledView } from '../ScaledCard'
import { useCredentialNameScale } from '../hooks'
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
import { DocumentCardProps } from './types'
import { TextLayoutEvent } from '~/types/props'
import { Colors } from '~/utils/colors'
import { ScanDocumentIcon } from '~/assets/svg'

const DocumentSectionDocumentCard: React.FC<DocumentCardProps> = ({
  credentialName,
  fields,
  photo = 'https://play-lh.googleusercontent.com/iPqyCoNDLdqRpykOWskqVynbgjPwcp-n8-HZjirdqq9VB39rCcPBneu3zMHL5Wadgmw',
  onHandleMore,
  // TODO @clauxx remove placeholders
  holderName = 'Cristian Lungu Vladislav',
  //backgroundColor = '#970009',
  backgroundColor,
  backgroundImage = 'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2004/06/forest/10237716-2-eng-GB/Forest_pillars.jpg',
  //backgroundImage,
  issuerIcon = 'https://play-lh.googleusercontent.com/iPqyCoNDLdqRpykOWskqVynbgjPwcp-n8-HZjirdqq9VB39rCcPBneu3zMHL5Wadgmw',
  hasImageFields = true,
  icons = [
    'https://cdn.countryflags.com/thumbs/germany/flag-400.png',
    'https://w7.pngwing.com/pngs/525/382/png-transparent-european-union-flag-of-europe-flags-graphics-blue-flag-computer-wallpaper.png',
  ],
}) => {
  const { isCredentialNameScaled } = useCredentialNameScale()

  const [holderNameLines, setHolderNameLines] = useState(0)
  const handleHolderNameTextLayout = (e: TextLayoutEvent) => {
    setHolderNameLines(e.nativeEvent.lines.length)
  }

  const calculateMaxFields = useCallback(() => {
    let maxFields = 6
    if (backgroundImage) {
      maxFields = maxFields - 2
    } else if (backgroundColor) {
      if (!holderName) maxFields = maxFields - 2
      else maxFields = maxFields - 4
    }

    if (holderNameLines > 1) {
      maxFields = maxFields - 2
    }

    if (!holderName && !backgroundImage) {
      maxFields = maxFields + 2
    }

    return maxFields
  }, [holderName, backgroundColor, backgroundImage, holderNameLines])

  const maxFields = calculateMaxFields()
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

  return (
    <ScaledCard
      originalHeight={scalingConfig.originalHeight}
      originalWidth={scalingConfig.originalWidth}
      originalScreenWidth={scalingConfig.originalScreenWidth}
      style={{
        overflow: 'hidden',
        flex: 1,
        backgroundColor: Colors.white,
      }}
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
          {renderBackground()}
          {photo && (
            <DocumentPhoto
              photo={photo}
              verticalPosition={!isBackground ? -50 : undefined}
            />
          )}
          {holderName && (
            <DocumentHolderName
              name={holderName}
              cropName={!!photo}
              onLayout={handleHolderNameTextLayout}
            />
          )}
          <ScaledView scaleStyle={{ paddingBottom: 16 }} />
          <DocumentFields
            fields={fields}
            maxLines={maxLinesPerField}
            maxFields={maxFields}
          />
        </View>
        <DocumentFooter
          leftIcons={icons}
          renderRightIcon={() => <ScanDocumentIcon />}
        />
      </View>
    </ScaledCard>
  )
}

export default DocumentSectionDocumentCard
