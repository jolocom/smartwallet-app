import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { debugView } from '~/utils/dev'
import Dots from './Dots'
import {
  TitleField,
  FieldName,
  FieldValue,
  SpecialField,
  Highlight,
} from './Field'

interface IField {
  name: string
  value: string | number
}

interface IProps {
  mandatoryFields: IField[]
  preferredFields: IField[]
  highlight?: string | undefined
  photo?: string | undefined
}

const DocumentCard: React.FC<IProps> = ({
  mandatoryFields,
  preferredFields,
  highlight,
  photo,
}) => {
  // TODO: here we should asert against enum that should come from SDK
  const getFieldInfo = (fieldName: string) =>
    mandatoryFields.find((el) => el.name === fieldName)

  const document = getFieldInfo('Document Type')
  const givenName = getFieldInfo('Given Name')

  const [isHeaderScalled, setIsHeaderScaled] = useState(false)
  const [numberOfOptionalLines, setNumberOfOptionalLines] = useState(0)

  const [displayedOptionalFields, setDisplayedOptionalFields] = useState(
    preferredFields,
  )

  const handleHeaderTextLayout = (e) => {
    console.log('handleHeaderTextLayout', e.nativeEvent)

    if (!isHeaderScalled) {
      setIsHeaderScaled(e.nativeEvent.lines.length > 2)
    }
  }

  const handleOptionalFieldTextLayout = (e) => {
    console.log('handleOptionalFieldTextLayout', e.nativeEvent)
    const numberOfLines = e.nativeEvent.lines.length
    setNumberOfOptionalLines((prevState) => prevState + numberOfLines)
  }

  /* check wether to show last optional field */
  useEffect(() => {
    if (numberOfOptionalLines > 6 && highlight) {
      setDisplayedOptionalFields((prevState) => prevState.slice(0, 2))
    }
  }, [numberOfOptionalLines])

  return (
    <View style={styles.container}>
      <DocumentCardMedium>
        <View style={styles.bodyContainer}>
          <View style={styles.cardHeader}>
            <TitleField
              onTextLayout={handleHeaderTextLayout}
              customStyles={{
                flex: 0.85,
                ...(isHeaderScalled && styles.scaledDocumentField),
              }}
            >
              {document?.value}
            </TitleField>
            <Dots />
          </View>
          <SpecialField numberOfLines={2}>{givenName?.value}</SpecialField>
          <View style={styles.optionalFieldsContainer}>
            {displayedOptionalFields.map((pField, idx) => {
              return (
                <View style={{ width: '100%' }}>
                  <FieldName
                    numberOfLines={1}
                    customStyles={{ marginBottom: 8 }}
                    onTextLayout={handleOptionalFieldTextLayout}
                  >
                    {pField.name}:
                  </FieldName>
                  {/* in case thers is a photo we should display last field differently */}
                  {idx === displayedOptionalFields.length - 1 && photo ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        zIndex: 100,
                      }}
                    >
                      <FieldValue
                        numberOfLines={2}
                        customStyles={{
                          marginBottom: 10,
                          flex: 0.7,
                        }}
                        onTextLayout={handleOptionalFieldTextLayout}
                      >
                        {pField.value}
                      </FieldValue>
                      <View style={{ flex: 0.3 }} />
                    </View>
                  ) : (
                    <FieldValue
                      numberOfLines={2}
                      customStyles={{
                        marginBottom: 10,
                      }}
                      onTextLayout={handleOptionalFieldTextLayout}
                    >
                      {pField.value}
                    </FieldValue>
                  )}
                </View>
              )
            })}
          </View>
        </View>
      </DocumentCardMedium>
      {photo ? (
        <View style={styles.photoContainer}>
          <Image style={styles.photo} source={{ uri: photo }} />
        </View>
      ) : null}
      {highlight ? (
        <View style={styles.highlight}>
          <Highlight>{highlight}</Highlight>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    ...debugView(),
  },
  bodyContainer: {
    transform: [{ scale: BP({ default: 1, xsmall: 0.9 }) }],
    height: '100%',
    alignSelf: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    // paddingHorizontal: 34, // TODO: remove later
    paddingTop: 22,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionalFieldsContainer: {
    alignItems: 'flex-start',
    marginTop: 10,
    width: '100%',
  },
  photoContainer: {
    position: 'absolute',
    right: 14,
    bottom: 27,
    zIndex: 10,
  },
  photo: {
    width: 82,
    height: 82,
    borderRadius: 41,
    zIndex: 10,
  },
  highlight: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    paddingTop: 17,
    paddingBottom: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.black,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 14,
    zIndex: 0,
  },
  scaledDocumentField: {
    fontSize: 22,
    lineHeight: 22,
    marginBottom: 20,
  },
})

export default DocumentCard
