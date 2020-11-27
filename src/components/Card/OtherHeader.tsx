import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { strings } from '~/translations'
import { useCard } from './Card'
import { FieldName, TitleField } from './Field'

const LARGE_LOGO_SIZE = 78
const SMALL_LOGO_SIZE = 37

const OtherHeader: React.FC = () => {
  const { document, image: logo } = useCard()
  const [isHeaderScalled, setIsHeaderScaled] = useState(false)
  const [titleLines, setTitleLines] = useState(0)

  const handleHeaderTextLayout = (e) => {
    if (!isHeaderScalled) {
      setTitleLines(e.nativeEvent.lines.length)
      setIsHeaderScaled(e.nativeEvent.lines.length > 2)
    }
  }

  return (
    <View
      style={[
        styles.header,
        { marginBottom: isHeaderScalled ? 20 : titleLines === 2 ? 23 : 49 },
      ]}
    >
      <View style={{ flex: isHeaderScalled ? 0.9 : 0.6 }}>
        <FieldName customStyles={{ marginBottom: 10 }}>
          {strings.TYPE_OF_DOCUMENT}
        </FieldName>
        <TitleField
          onTextLayout={handleHeaderTextLayout}
          numberOfLines={isHeaderScalled ? 2 : undefined}
          customStyles={{
            ...(isHeaderScalled && styles.scaledDocumentField),
          }}
        >
          {document?.value}
        </TitleField>
      </View>
      <View style={{ flex: isHeaderScalled ? 0.1 : 0.4 }}>
        <Image
          source={{ uri: logo }}
          style={[
            styles.logo,
            {
              width: isHeaderScalled ? SMALL_LOGO_SIZE : LARGE_LOGO_SIZE,
              height: isHeaderScalled ? SMALL_LOGO_SIZE : LARGE_LOGO_SIZE,
              borderRadius: isHeaderScalled
                ? SMALL_LOGO_SIZE / 2
                : LARGE_LOGO_SIZE / 2,
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
  },
  scaledDocumentField: {
    fontSize: 22,
    lineHeight: 22,
    marginBottom: 20,
  },
  logo: {
    position: 'absolute',
    top: -5,
    right: 0,
  },
})

export default OtherHeader
