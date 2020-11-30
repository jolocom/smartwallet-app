import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import BP from '~/utils/breakpoints'
import { useTabs } from '../Tabs/Tabs'
import { useCard } from './Card'
import { FieldName, FieldValue, TextLayoutEvent } from './Field'
import { DocumentTypes, IWithCustomStyle } from './types'

const OptionalFields: React.FC<IWithCustomStyle> = ({
  customStyles: customContainerStyles,
}) => {
  const { optionalFields, highlight, image } = useCard()
  const [displayedOptionalFields, setDisplayedOptionalFields] = useState(
    optionalFields.slice(0, 3),
  )

  const { activeTab } = useTabs()

  const lines = useRef(0)

  const handleOptionalFieldTextLayout = () => {
    let calculatedTimes = 0
    return (e: TextLayoutEvent) => {
      calculatedTimes++
      // disable lines manipulation if the number of times this function was invoked
      // exceeds length of otional firlds twice (because we calculate field name and
      // field value )
      if (calculatedTimes < optionalFields.length * 2 + 1) {
        const numberOfLines = e.nativeEvent.lines.length
        lines.current += numberOfLines
        if (calculatedTimes === optionalFields.length * 2) {
          /* check wether to show last optional field */
          if (
            lines.current > 7 &&
            (highlight || (image && DocumentTypes.document))
          ) {
            setDisplayedOptionalFields((prevState) =>
              prevState.slice(
                0,
                Math.floor(lines.current / optionalFields.length),
              ),
            )
          } else if (lines.current > 9 && !highlight) {
            setDisplayedOptionalFields((prevState) => prevState.slice(0, 3))
          }
        }
      }
    }
  }

  const onTextLayoutChange = handleOptionalFieldTextLayout()

  const renderFieldValue = (
    value: string | number,
    padding?: string | number,
  ) => {
    return (
      <FieldValue
        numberOfLines={2}
        customStyles={{
          marginBottom: BP({
            default: 10,
            xsmall: 5,
          }),
          paddingRight: padding,
        }}
        onTextLayout={onTextLayoutChange}
      >
        {value}
      </FieldValue>
    )
  }

  const renderFieldName = (value: string) => {
    return (
      <FieldName
        numberOfLines={1}
        customStyles={{
          marginBottom: BP({
            default: 8,
            xsmall: 0,
          }),
        }}
        onTextLayout={onTextLayoutChange}
      >
        {value}:
      </FieldName>
    )
  }

  return (
    <View style={[styles.container, customContainerStyles]}>
      {displayedOptionalFields.map((pField, idx) => (
        <View style={{ width: '100%' }} key={pField.name + idx}>
          {renderFieldName(pField.name)}
          {/* in case thers is a photo we should display last field differently */}
          {idx === displayedOptionalFields.length - 1 && image
            ? renderFieldValue(pField.value, '30%')
            : renderFieldValue(pField.value)}
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
