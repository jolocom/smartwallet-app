import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { strings } from '~/translations'
import BP from '~/utils/breakpoints'
import { useCard } from './context'
import { FieldName, TitleField, TextLayoutEvent } from './Field'

const LARGE_LOGO_SIZE = BP({ default: 78, xsmall: 60 })
const SMALL_LOGO_SIZE = 37

const OtherHeader: React.FC = () => {
  const { document, image: logo } = useCard()
  const [isHeaderScalled, setIsHeaderScaled] = useState(false)

  const handleHeaderTextLayout = (e: TextLayoutEvent) => {
    if (!isHeaderScalled) {
      setIsHeaderScaled(e.nativeEvent.lines.length > 2)
    }
  }

  return (
    <View style={styles.header}>
      <View style={{ flex: isHeaderScalled ? 0.9 : 1 }}>
        <FieldName
          numberOfLines={1}
          customStyles={{
            marginBottom: isHeaderScalled
              ? BP({ default: 12, xsmall: 8 })
              : BP({ default: 8, xsmall: 4 }),
          }}
        >
          {strings.TYPE_OF_DOCUMENT}
        </FieldName>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <TitleField
            onTextLayout={handleHeaderTextLayout}
            numberOfLines={isHeaderScalled ? 2 : undefined}
            customStyles={{
              flexWrap: 'wrap',
              ...(isHeaderScalled && styles.scaledDocumentField),
            }}
          >
            {document?.value}
          </TitleField>
        </View>
      </View>
      {logo ? (
        <View
          style={{
            flex: isHeaderScalled ? 0.1 : 0,
            alignItems: 'flex-end',
          }}
        >
          <Image
            testID="card-logo"
            source={{ uri: logo }}
            style={[
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
      ) : null}
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
})

export default OtherHeader
