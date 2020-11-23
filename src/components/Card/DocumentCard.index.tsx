import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutChangeEvent,
  LayoutRectangle,
} from 'react-native'
import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import { Colors } from '~/utils/colors'
import { debugView } from '~/utils/dev'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind, JoloTextWeight } from '../JoloText'

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

const Dots = () => {
  return (
    <TouchableOpacity style={styles.dotsContainer}>
      {['a', 'b', 'c'].map((c) => (
        <View key={c} style={styles.dot} />
      ))}
    </TouchableOpacity>
  )
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

  const handleSVGLayout = (e: LayoutChangeEvent) => {
    setSVGLayout(e.nativeEvent.layout)
  }

  const handleHeaderTextLayout = (e) => {
    if (!isHeaderScalled) {
      setIsHeaderScaled(e.nativeEvent.lines.length > 2)
    }
  }

  return (
    <View>
      <View>
        <DocumentCardMedium onLayout={handleSVGLayout} />
      </View>
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
          <JoloText
            kind={isHeaderScalled ? JoloTextKind.subtitle : JoloTextKind.title}
            color={Colors.black}
            weight={JoloTextWeight.regular}
            customStyles={{
              flex: 0.85,
              textAlign: 'left',
              ...(isHeaderScalled && styles.scaledFont),
            }}
            onTextLayout={handleHeaderTextLayout}
          >
            {document?.value}
          </JoloText>
          <Dots />
        </View>
        <JoloText
          color={Colors.black}
          weight={JoloTextWeight.medium}
          customStyles={{ marginLeft: 10 }}
        >
          {givenName?.value}
        </JoloText>

        <View style={styles.optionalFieldsContainer}>
          {preferredFields.map((pField) => (
            <>
              <JoloText
                size={JoloTextSizes.mini}
                color={Colors.slateGray}
                customStyles={{ textAlign: 'left' }}
                numberOfLines={1}
              >
                {pField.name}:
              </JoloText>
              <JoloText
                color={Colors.black}
                weight={JoloTextWeight.medium}
                customStyles={{ textAlign: 'left' }}
                numberOfLines={2}
              >
                {pField.value}
              </JoloText>
            </>
          ))}
        </View>
        {highlight ? (
          <View style={styles.highlight}>
            <JoloText>{highlight}</JoloText>
          </View>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  bodyContainer: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingTop: 22,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...debugView(),
  },
  scaledFont: {
    fontSize: 22,
    lineHeight: 22,
    marginBottom: 15,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.black,
    marginHorizontal: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 15,
    paddingRight: 15,
    flex: 0.15,
  },
  optionalFieldsContainer: {
    alignItems: 'flex-start',
    marginTop: 10,
    // marginRight: 40,
    ...debugView(),
  },
  highlight: {
    position: 'absolute',
    alignItems: 'flex-start',
    bottom: 0,
    alignSelf: 'flex-end',
    width: '110%',
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: Colors.black,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 14,
  },
})

export default DocumentCard
