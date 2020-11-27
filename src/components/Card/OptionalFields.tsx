import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import BP from '~/utils/breakpoints'
import { debugView } from '~/utils/dev'
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

  const lines = useRef(0)

  /* check wether to show last optional field */
  useEffect(() => {
    console.log('lines', lines.current)

    if (lines.current > 6 && highlight) {
      setDisplayedOptionalFields((prevState) => prevState.slice(0, 2))
    } else if (lines.current > 9 && !highlight) {
      setDisplayedOptionalFields((prevState) => prevState.slice(0, 3))
    }
  }, [])

  const handleOptionalFieldTextLayout = (e) => {
    const numberOfLines = e.nativeEvent.lines.length
    // setNumberOfOptionalLines((prevState) => prevState + numberOfLines)
    lines.current += numberOfLines
  }

  // useLayoutEffect(() => {
  //   const numberOfLines = e.nativeEvent.lines.length
  //   setNumberOfOptionalLines((prevState) => prevState + numberOfLines)
  // }, [])

  // console.log('rerender')

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
              }}
            >
              <FieldValue
                // numberOfLines={
                //   displayedOptionalFields.length === optionalFields.length
                //     ? undefined
                //     : BP({ default: 2, xsmall: 1 })
                // }
                numberOfLines={BP({ default: 2, xsmall: 1 })}
                customStyles={{
                  marginBottom: 10,
                  flex: 0.7,
                  ...debugView(),
                }}
                onTextLayout={handleOptionalFieldTextLayout}
              >
                {pField.value}
              </FieldValue>
              <View style={{ flex: 0.3 }} />
            </View>
          ) : (
            <FieldValue
              numberOfLines={BP({ default: 2, xsmall: 1 })}
              customStyles={{
                marginBottom: 10,
                ...debugView(),
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
    ...debugView(),
  },
})

export default OptionalFields
