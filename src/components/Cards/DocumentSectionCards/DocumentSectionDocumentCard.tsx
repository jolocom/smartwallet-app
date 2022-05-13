import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'

import ScaledCard, { ScaledView } from '../ScaledCard'
import { useCredentialNameScale } from '../hooks'
import {
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
  ORIGINAL_DOCUMENT_SCREEN_WIDTH,
} from './consts'
import {
  CardMoreBtn,
  DocumentFields,
  DocumentFooter,
  DocumentHeader,
  DocumentHolderName,
  DocumentPhoto,
} from './components'
import { DocumentCardProps } from './types'
import { TextLayoutEvent } from '~/types/props'

const DocumentSectionDocumentCard: React.FC<DocumentCardProps> = ({
  credentialName,
  holderName,
  fields,
  photo,
  onHandleMore,
}) => {
  const { isCredentialNameScaled } = useCredentialNameScale()

  const [holderNameLines, setHolderNameLines] = useState(0)
  const handleHolderNameTextLayout = (e: TextLayoutEvent) => {
    setHolderNameLines(e.nativeEvent.lines.length)
  }

  const maxLinesPerField =
    isCredentialNameScaled && holderNameLines === 2 ? 4 : 5
  const maxFields = 4

  const scalingConfig = {
    originalHeight: ORIGINAL_DOCUMENT_CARD_HEIGHT,
    originalWidth: ORIGINAL_DOCUMENT_CARD_WIDTH,
    originalScreenWidth: ORIGINAL_DOCUMENT_SCREEN_WIDTH,
  }

  const MOCK_STYLES = {
    icon: 'https://play-lh.googleusercontent.com/iPqyCoNDLdqRpykOWskqVynbgjPwcp-n8-HZjirdqq9VB39rCcPBneu3zMHL5Wadgmw',
  }

  return (
    <ScaledCard
      originalHeight={scalingConfig.originalHeight}
      originalWidth={scalingConfig.originalWidth}
      originalScreenWidth={scalingConfig.originalScreenWidth}
      style={{
        overflow: 'hidden',
        flex: 1,
        backgroundColor: 'white',
      }}
      scaleStyle={{ borderRadius: 15 }}
      testID="documentCard"
    >
      <View style={{ flex: 1 }}>
        <ScaledView
          style={{
            flex: 1,
            flexDirection: 'column',
            width: '100%',
          }}
          scaleStyle={styles.bodyContainer}
        >
          <DocumentHeader
            name={credentialName}
            icon={MOCK_STYLES.icon}
            onPressMenu={onHandleMore}
          />
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
        </ScaledView>
        <DocumentFooter />
      </View>
      {photo && <DocumentPhoto photo={photo} />}
    </ScaledCard>
  )
}

const styles = StyleSheet.create({
  bodyContainer: {
    paddingHorizontal: 16,
  },
})

export default DocumentSectionDocumentCard
