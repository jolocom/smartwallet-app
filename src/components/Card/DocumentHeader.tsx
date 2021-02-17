import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import BP from '~/utils/breakpoints'
import { useCard } from './context'
import { SpecialField, TitleField, TextLayoutEvent } from './Field'

const DocumentHeader: React.FC = () => {
  const { document, restMandatoryField } = useCard()
  const [isHeaderScalled, setIsHeaderScaled] = useState(false)

  const handleHeaderTextLayout = (e: TextLayoutEvent) => {
    if (!isHeaderScalled) {
      setIsHeaderScaled(e.nativeEvent.lines.length > 2)
    }
  }

  return (
    <>
      <View style={styles.header}>
        <TitleField
          onTextLayout={handleHeaderTextLayout}
          numberOfLines={isHeaderScalled ? 2 : undefined}
          customStyles={{
            flex: 0.85,
            ...(isHeaderScalled && styles.scaledDocumentField),
          }}
        >
          {document?.value}
        </TitleField>
        <View style={{ flex: 0.15 }} />
      </View>
      {restMandatoryField && (
        <SpecialField numberOfLines={2}>
          {restMandatoryField?.value}
        </SpecialField>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaledDocumentField: {
    fontSize: BP({ default: 22, xsmall: 20 }),
    lineHeight: 22,
    marginBottom: 20,
  },
})

export default DocumentHeader
