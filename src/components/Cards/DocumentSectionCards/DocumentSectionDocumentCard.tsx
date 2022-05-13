import React, { useState, StyleProp, ViewStyle } from 'react'
import { View, Image, StyleSheet } from 'react-native'

import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import ScaledCard, { ScaledText, ScaledView } from '../ScaledCard'
import { useCredentialNameScale, usePruneFields } from '../hooks'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'
import {
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
  ORIGINAL_DOCUMENT_SCREEN_WIDTH,
} from './consts'
import { CardMoreBtn } from './components'
import { DocumentCardProps } from './types'
import { FieldsCalculator } from '../InteractionShare/components'
import { TextLayoutEvent } from '~/types/props'
import { debugView } from '~/utils/dev'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

const DocumentFooter: React.FC<{
  rightIcons?: string[]
  leftIcons?: string[]
  style?: StyleProp<ViewStyle>
}> = ({ rightIcons, leftIcons, style = {} }) => {
  //TODO use icons
  return (
    <ScaledView
      style={[styles.footerContainer, style]}
      scaleStyle={styles.footerContainerScaled}
    >
      <View style={styles.footerBorder} />
    </ScaledView>
  )
}

const DocumentPhoto: React.FC<{ photo: string }> = ({ photo }) => (
  <ScaledView
    scaleStyle={styles.photoContainerScaled}
    style={styles.photoContainer}
  >
    <Image resizeMode="cover" style={styles.photo} source={{ uri: photo }} />
  </ScaledView>
)

const DocumentHeader: React.FC<{ name: string; icon?: string }> = ({
  name,
  icon,
}) => {
  const { isCredentialNameScaled, handleCredentialNameTextLayout } =
    useCredentialNameScale()

  return (
    <View style={{ flexDirection: 'row', width: '100%' }}>
      <ScaledText
        // @ts-expect-error
        onTextLayout={handleCredentialNameTextLayout}
        numberOfLines={1}
        scaleStyle={
          isCredentialNameScaled
            ? styles.credentialNameScaled
            : styles.credentialName
        }
        style={[styles.regularText, { flex: 0.863 }]}
      >
        {name}
      </ScaledText>
    </View>
  )
}

const DocumentHolderName: React.FC<{
  name: string
  onLayout: (e: TextLayoutEvent) => void
}> = ({ name, onLayout }) => {
  const { isCredentialNameScaled } = useCredentialNameScale()
  return (
    <>
      <ScaledView
        scaleStyle={{ paddingBottom: isCredentialNameScaled ? 22 : 16 }}
      />
      <ScaledView
        scaleStyle={{
          paddingHorizontal: 10,
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
    </>
  )
}

const DocumentFields: React.FC<{
  fields: Required<DisplayVal>[]
  maxFields: number
  maxLines: number
}> = ({ fields, maxLines, maxFields }) => {
  const {
    displayedFields,
    handleFieldValueLayout,
    handleFieldValuesVisibility,
  } = usePruneFields(fields, maxFields, maxLines)

  return (
    <FieldsCalculator cbFieldsVisibility={handleFieldValuesVisibility}>
      {displayedFields.map((f, idx) => (
        <React.Fragment key={f.key}>
          {idx !== 0 && <ScaledView scaleStyle={{ paddingBottom: 14 }} />}
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
            {f.label.trim()}:
          </ScaledText>
          <ScaledView scaleStyle={{ paddingBottom: 9 }} />
          <ScaledText
            numberOfLines={2}
            //@ts-expect-error
            onTextLayout={(e: TextLayoutEvent) =>
              handleFieldValueLayout(e, idx)
            }
            scaleStyle={styles.fieldText}
            style={[
              styles.mediumText,
              {
                width: '100%',
              },
            ]}
          >
            {f.value}
          </ScaledText>
        </React.Fragment>
      ))}
    </FieldsCalculator>
  )
}

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
          <DocumentHeader name={credentialName} />
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
      <CardMoreBtn
        onPress={onHandleMore}
        positionStyles={{
          top: 18,
          right: 17,
        }}
      />
    </ScaledCard>
  )
}

const styles = StyleSheet.create({
  bodyContainer: {
    paddingTop: 22,
    paddingHorizontal: 14,
    paddingBottom: 14,
    //flex: 1,
  },
  credentialName: {
    fontSize: 28,
    lineHeight: 28,
  },
  credentialNameScaled: {
    fontSize: 22,
    lineHeight: 22,
  },
  holderName: {
    fontSize: 20,
    lineHeight: 20,
  },
  photoContainer: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 10,
  },
  photoContainerScaled: {
    bottom: 27,
    right: 14,
    width: 82,
    height: 82,
    borderRadius: 41,
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

export default DocumentSectionDocumentCard
