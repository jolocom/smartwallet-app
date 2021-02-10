import React from 'react'
import { StyleSheet, TouchableOpacity, View, TextStyle } from 'react-native'

import { PurpleTickSuccess } from '~/assets/svg'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useWidget } from '.'
import JoloText, { JoloTextKind } from '../JoloText'

export type TField = IFieldComposition & React.FC

interface IFieldComposition {
  Static: React.FC<Pick<IWidgetField, 'value'>>
  Selectable: React.FC<Pick<IWidgetField, 'value' | 'isSelected' | 'onSelect'>>
  Empty: React.FC
}

export interface IWidgetField {
  id: string
  value: string
  isSelected?: boolean
  color?: Colors
  onSelect?: () => void
}

const FieldText: React.FC<
  Pick<IWidgetField, 'value' | 'color'> & { customStyles?: TextStyle }
> = ({ value, color = Colors.white90, customStyles = {} }) => {
  return (
    <JoloText
      numberOfLines={1}
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.middle}
      color={color}
      customStyles={[{ textAlign: 'left' }, customStyles]}
    >
      {value}
    </JoloText>
  )
}

const StaticField: React.FC<Pick<IWidgetField, 'value'>> = ({ value }) => {
  return (
    <FieldContainer>
      <FieldText value={value} />
    </FieldContainer>
  )
}

const SelectableField: React.FC<
  Pick<IWidgetField, 'value' | 'isSelected' | 'onSelect'>
> = ({ value, isSelected, onSelect }) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onSelect}>
      <FieldContainer>
        <FieldText value={value} customStyles={{ width: '85%' }} />
        {isSelected ? (
          <View style={styles.radio}>
            <PurpleTickSuccess />
          </View>
        ) : (
          <View style={[styles.radio, styles.notSelected]} />
        )}
      </FieldContainer>
    </TouchableOpacity>
  )
}

const EmptyField: React.FC = () => {
  const widgetContext = useWidget()
  if (!widgetContext?.onCreate)
    throw new Error('No method provided for creating new attribute')

  return (
    <TouchableOpacity onPress={widgetContext.onCreate}>
      <FieldContainer>
        <FieldText value={strings.MISSING_INFO} color={Colors.error} />
      </FieldContainer>
    </TouchableOpacity>
  )
}

const FieldContainer: React.FC = ({ children }) => {
  return <View style={styles.field}>{children}</View>
}

const Field: React.FC & IFieldComposition = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  radio: {
    width: 20,
    height: 20,
  },
  notSelected: {
    borderColor: Colors.white45,
    opacity: 0.3,
    borderWidth: 1,
    borderRadius: 10,
  },
  field: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 23,
    backgroundColor: Colors.black,
    borderRadius: 8,
    height: 50,
    marginVertical: 2,
  },
})

Field.Static = StaticField
Field.Selectable = SelectableField
Field.Empty = EmptyField

export default Field