import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import BP from '~/utils/breakpoints'
import { useCard } from './Card'
import { FieldName, FieldValue } from './Field'
import { IWithCustomStyle } from './types'

const OptionalFields: React.FC<IWithCustomStyle> = ({
  customStyles: customContainerStyles,
}) => {
  const {
    numberOfOptionalLines,
    setNumberOfOptionalLines,
    optionalFields,
    highlight,
    image,
  } = useCard()
  const [displayedOptionalFields, setDisplayedOptionalFields] = useState(
    optionalFields,
  )

  /* check wether to show last optional field */
  useEffect(() => {
    if (numberOfOptionalLines > BP({ default: 6, xsmall: 5 }) && highlight) {
      setDisplayedOptionalFields((prevState) => prevState.slice(0, 2))
    } else if (
      numberOfOptionalLines > BP({ default: 9, xsmall: 6 }) &&
      !highlight
    ) {
      setDisplayedOptionalFields((prevState) =>
        prevState.slice(0, BP({ default: 3, xsmall: 2 })),
      )
    }
  }, [numberOfOptionalLines])

  const handleOptionalFieldTextLayout = (e) => {
    const numberOfLines = e.nativeEvent.lines.length
    setNumberOfOptionalLines((prevState) => prevState + numberOfLines)
  }

  return (
    <View style={[styles.container, customContainerStyles]}>
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
