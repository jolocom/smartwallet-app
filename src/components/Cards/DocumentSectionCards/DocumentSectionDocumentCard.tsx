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

const DocumentSectionDocumentCard: React.FC<DocumentCardProps> = ({
  credentialName,
  fields,
  photo,
  onHandleMore,
  // TODO @clauxx remove placeholders
  holderName = 'Cristian Lungu Vladislav Veronica',
  backgroundColor = '#970009',
  backgroundImage = 'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2004/06/forest/10237716-2-eng-GB/Forest_pillars.jpg',
  issuerIcon = 'https://play-lh.googleusercontent.com/iPqyCoNDLdqRpykOWskqVynbgjPwcp-n8-HZjirdqq9VB39rCcPBneu3zMHL5Wadgmw',
}) => {
  const { isCredentialNameScaled } = useCredentialNameScale()

  const [holderNameLines, setHolderNameLines] = useState(0)
  const handleHolderNameTextLayout = (e: TextLayoutEvent) => {
    setHolderNameLines(e.nativeEvent.lines.length)
  }

  const calculateMaxFields = useCallback(() => {
    let maxFields = holderName ? 3 : 4
    if (backgroundImage || backgroundColor) {
      maxFields--
    }
    if (holderNameLines > 1) {
      maxFields--
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
      return <ScaledView scaleStyle={{ height: 20 }} />
    }
  }, [backgroundColor, backgroundImage])

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
          {holderName && (
            <DocumentHolderName
              name={holderName}
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
        <DocumentFooter />
      </View>
      {photo && <DocumentPhoto photo={photo} />}
    </ScaledCard>
  )
}

export default DocumentSectionDocumentCard
