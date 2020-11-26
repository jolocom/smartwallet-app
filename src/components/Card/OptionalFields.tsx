import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useCard } from './Card'
import { FieldName, FieldValue } from './Field'

const OptionalFields = () => {
  const {
    numberOfOptionalLines,
    setNumberOfOptionalLines,
    preferredFields,
    image,
  } = useCard()
  const [displayedOptionalFields, setDisplayedOptionalFields] = useState(
    preferredFields,
  )

  const handleOptionalFieldTextLayout = (e) => {
    const numberOfLines = e.nativeEvent.lines.length
    setNumberOfOptionalLines((prevState) => prevState + numberOfLines)
  }

  return (
    <View style={styles.container}>
      {displayedOptionalFields.map((pField, idx) => (
        <View style={{ width: '100%' }}>
          <FieldName
            numberOfLines={1}
            customStyles={{ marginBottom: 8 }}
            onTextLayout={handleOptionalFieldTextLayout}
          >
            {pField.name}:
          </FieldName>
          {/* in case thers is a photo we should display last field differently */}
          {idx === displayedOptionalFields.length - 1 && image ? (
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
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginTop: 10,
    width: '100%',
  },
})

export default OptionalFields
