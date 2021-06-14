import React from 'react'
import { StyleSheet, TouchableOpacity, View, TextStyle } from 'react-native'

import { PurpleTickSuccess } from '~/assets/svg'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useWidget } from './context'
import { IWithCustomStyle } from '../Card/types'
import JoloText, { JoloTextKind } from '../JoloText'
import BP from '~/utils/breakpoints'

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
  /**
   * NOTE: this is to allocate 4 lines for address attribute type
   */
  const numberOfValueLines = value.split('\n').length

  return (
    <JoloText
      numberOfLines={numberOfValueLines}
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.middle}
      color={color}
      customStyles={[
        {
          textAlign: 'left',
          ...(numberOfValueLines > 1 && {
            lineHeight: BP({ default: 22, large: 26 }),
            paddingVertical: BP({ default: 20, xsmall: 16 }),
            paddingTop: BP({ default: 14, xsmall: 10 }),
          }),
        },
        customStyles,
      ]}
    >
      {value}
    </JoloText>
  )
}

const StaticField: React.FC<Pick<IWidgetField, 'value'>> = ({ value }) => {
  return (
    <View testID="widget-field-static">
      <FieldContainer>
        <FieldText value={value} />
      </FieldContainer>
    </View>
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

const EmptyField: React.FC = ({ children }) => {
  const widgetContext = useWidget()
  if (!widgetContext?.onAdd)
    throw new Error('No method provided for creating new attribute')

  return (
    <TouchableOpacity onPress={widgetContext.onAdd} testID="widget-field-empty">
      <FieldContainer>
        {children ? (
          children
        ) : (
          <FieldText value={strings.MISSING_INFO} color={Colors.error} />
        )}
      </FieldContainer>
    </TouchableOpacity>
  )
}

const FieldContainer: React.FC<IWithCustomStyle> = ({
  children,
  customStyles,
}) => {
  return <View style={[styles.field, customStyles]}>{children}</View>
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
    minHeight: 50,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: Colors.balticSea,
  },
})

Field.Static = StaticField
Field.Selectable = SelectableField
Field.Empty = EmptyField

export default Field
