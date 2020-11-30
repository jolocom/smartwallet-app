import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import BP from '~/utils/breakpoints'
import { useTabs } from '../Tabs/Tabs'
import { useCard } from './Card'
import { FieldName, FieldValue } from './Field'
import { DocumentTypes, IWithCustomStyle } from './types'

const OptionalFields: React.FC<IWithCustomStyle> = ({
  customStyles: customContainerStyles,
}) => {
  const { optionalFields, highlight, image } = useCard()
  const [displayedOptionalFields, setDisplayedOptionalFields] = useState(
    optionalFields,
  )

  const { activeTab } = useTabs()

  const lines = useRef(0)

  const handleOptionalFieldTextLayout = () => {
    let calculatedTimes = 0
    return (e) => {
      calculatedTimes++
      // disable lines manipulation if the number of times this function was invoked
      // exceeds length of otional firlds twice (because we calculate field name and
      // field value )
      if (calculatedTimes < optionalFields.length * 2 + 1) {
        const numberOfLines = e.nativeEvent.lines.length
        lines.current += numberOfLines
        if (calculatedTimes === optionalFields.length * 2) {
          /* check wether to show last optional field */
          if (lines.current > 6 && highlight) {
            setDisplayedOptionalFields((prevState) => prevState.slice(0, 2))
          } else if (lines.current > 9 && !highlight) {
            setDisplayedOptionalFields((prevState) => prevState.slice(0, 3))
          }
        }
      }
    }
  }

  const onTextLayoutChange = handleOptionalFieldTextLayout()

  return (
    <View style={[styles.container, customContainerStyles]}>
      {displayedOptionalFields.map((pField, idx) => (
        <View style={{ width: '100%' }}>
          <FieldName
            numberOfLines={1}
            customStyles={{
              marginBottom: BP({
                default: 8,
                xsmall: activeTab?.id === DocumentTypes.document ? 0 : 8,
              }),
            }}
            onTextLayout={onTextLayoutChange}
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
                numberOfLines={BP({ default: 2, xsmall: 1 })}
                customStyles={{
                  marginBottom: BP({
                    default: 10,
                    xsmall: activeTab?.id === DocumentTypes.document ? 5 : 10,
                  }),
                  flex: 0.7,
                }}
                onTextLayout={onTextLayoutChange}
              >
                {pField.value}
              </FieldValue>
              <View style={{ flex: 0.3 }} />
            </View>
          ) : (
            <FieldValue
              numberOfLines={BP({ default: 2, xsmall: 1 })}
              customStyles={{
                marginBottom: BP({
                  default: 10,
                  xsmall: activeTab?.id === DocumentTypes.document ? 5 : 10,
                }),
              }}
              onTextLayout={onTextLayoutChange}
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
