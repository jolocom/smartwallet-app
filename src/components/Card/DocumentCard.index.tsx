import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  LayoutChangeEvent,
  LayoutRectangle,
  Image,
} from 'react-native'
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

const HORIZONTAL_SHADOW = 13
const TOP_SHADOW = 9
const BOTTOM_SHADOW = 17

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

  const [svgLayout, setSVGLayout] = useState<LayoutRectangle | null>(null)
  const [isHeaderScalled, setIsHeaderScaled] = useState(false)
  const [areOptionalFieldsCut, setAreOptionalFieldsCut] = useState(false)
  const [isOptionTrimmed, setIsOptionTrimmed] = useState(false)

  const displayedOptionalField = areOptionalFieldsCut
    ? preferredFields.slice(0, 2)
    : preferredFields

  const handleSVGLayout = (e: LayoutChangeEvent) => {
    setSVGLayout(e.nativeEvent.layout)
  }

  const handleHeaderTextLayout = (e) => {
    if (!isHeaderScalled) {
      setIsHeaderScaled(e.nativeEvent.lines.length > 2)
    }
  }

  const handleOptionFieldsLayou = (e: LayoutChangeEvent) => {
    if (e.nativeEvent.layout.height > 185 && highlight) {
      setAreOptionalFieldsCut(true)
    }
  }

  const handleTrimField = (idx: number, e) => {
    if (
      idx === displayedOptionalField.length - 1 &&
      e.nativeEvent.lines.length === 2
    ) {
      setIsOptionTrimmed(true)
    }
  }

  return (
    <View style={styles.container}>
      <DocumentCardMedium onLayout={handleSVGLayout}>
        <View
          style={[
            styles.bodyContainer,
            // aligning body with SVG size
            {
              marginTop: TOP_SHADOW,
              marginBottom: BOTTOM_SHADOW,
              width: (svgLayout?.width ?? 348) - HORIZONTAL_SHADOW * 2,
              height: (svgLayout?.height ?? 348) - TOP_SHADOW - BOTTOM_SHADOW,
            },
          ]}
        >
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
          <View
            style={styles.optionalFieldsContainer}
            onLayout={handleOptionFieldsLayou}
          >
            {displayedOptionalField.map((pField, idx) => (
              <>
                <FieldName numberOfLines={1} customStyles={{ marginBottom: 8 }}>
                  {pField.name}:
                </FieldName>
                <FieldValue
                  numberOfLines={2}
                  onTextLayout={(e) => handleTrimField(idx, e)}
                  customStyles={{
                    marginBottom: 10,
                    marginRight:
                      isOptionTrimmed &&
                      idx === displayedOptionalField.length - 1 &&
                      areOptionalFieldsCut
                        ? 70
                        : 0,
                  }}
                >
                  {pField.value}
                </FieldValue>
              </>
            ))}
          </View>
        </View>
        {photo ? (
          <View
            style={[
              styles.photoContainer,
              { marginBottom: BOTTOM_SHADOW, marginRight: HORIZONTAL_SHADOW },
            ]}
          >
            <Image style={styles.photo} source={{ uri: photo }} />
          </View>
        ) : null}
        {highlight ? (
          <View
            style={[
              styles.highlight,
              {
                marginTop: TOP_SHADOW,
                marginBottom: BOTTOM_SHADOW,
                width: (svgLayout?.width ?? 348) - HORIZONTAL_SHADOW * 2,
              },
            ]}
          >
            <Highlight>{highlight}</Highlight>
          </View>
        ) : null}
      </DocumentCardMedium>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    transform: [{ scale: BP({ default: 1, small: 0.95, xsmall: 0.8 }) }],
  },
  bodyContainer: {
    // position: 'absolute',
    alignSelf: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingTop: 22,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionalFieldsContainer: {
    alignItems: 'flex-start',
    marginTop: 10,
    // ...debugView(),
  },
  photoContainer: {
    position: 'absolute',
    bottom: 27,
    right: 14,
    zIndex: 10,
  },
  photo: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },
  highlight: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    paddingTop: 17,
    paddingBottom: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.black,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 14,
  },
  scaledDocumentField: {
    fontSize: 22,
    lineHeight: 22,
    marginBottom: 20,
  },
})

export default DocumentCard

// add highlight condition:
// - hightlight: 6
// - n/highlight: 9
