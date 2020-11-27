import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useCard } from './Card'
import Dots from './Dots'
import { TitleField } from './Field'

const CardHeader: React.FC = () => {
  const { document } = useCard()
  const [isHeaderScalled, setIsHeaderScaled] = useState(false)

  const handleHeaderTextLayout = (e) => {
    if (!isHeaderScalled) {
      setIsHeaderScaled(e.nativeEvent.lines.length > 2)
    }
  }

  return (
    <View style={styles.header}>
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
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaledDocumentField: {
    fontSize: 22,
    lineHeight: 22,
    marginBottom: 20,
  },
})

export default CardHeader
