import React from 'react'
import { StyleSheet, TouchableOpacity, View, TextStyle } from 'react-native'
import { PurpleTickSuccess } from '~/assets/svg'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useWidget } from './context'
import JoloText from '../JoloText'
import { IWithCustomStyle } from '~/types/props'
import useTranslation from '~/hooks/useTranslation'

export type TField = IFieldComposition & React.FC

interface IFieldComposition {
  Static: React.FC<Pick<IWidgetField, 'value'>>
  Selectable: React.FC<
    Pick<IWidgetField, 'value' | 'isSelected' | 'onSelect' | 'disabled'>
  >
  Empty: React.FC
}

export interface IWidgetField {
  id: string
  value: string | string[]
  isSelected?: boolean
  color?: Colors
  onSelect?: () => void
  disabled?: boolean
}

const FieldText: React.FC<
  Pick<IWidgetField, 'value' | 'color'> & { customStyles?: TextStyle }
> = ({ value, color = Colors.white90, customStyles = {} }) => {
  const renderText = (value: string) => (
    <JoloText
      numberOfLines={1}
      size={JoloTextSizes.middle}
      color={color}
      customStyles={[
        {
          textAlign: 'left',
        },
        customStyles,
      ]}
    >
      {value}
    </JoloText>
  )

  return Array.isArray(value) ? (
    <View style={{ paddingTop: 12, paddingBottom: 16 }}>
      {value.map(renderText)}
    </View>
  ) : (
    renderText(value)
  )
}

const StaticField: React.FC<Pick<IWidgetField, 'value'>> = ({ value }) => (
  <View testID="widget-field-static">
    <FieldContainer>
      <FieldText value={value} />
    </FieldContainer>
  </View>
)

const SelectableField: React.FC<
  Pick<IWidgetField, 'value' | 'isSelected' | 'onSelect' | 'disabled'>
> = ({ value, isSelected, onSelect, disabled = false }) => (
  <TouchableOpacity
    testID="selectable-field"
    activeOpacity={0.7}
    disabled={disabled}
    onPress={onSelect}
  >
    <FieldContainer>
      <FieldText value={value} customStyles={{ width: '85%' }} />
      {isSelected ? (
        <View style={[styles.radio, disabled && { opacity: 0.4 }]}>
          <PurpleTickSuccess />
        </View>
      ) : (
        <View style={[styles.radio, styles.notSelected]} />
      )}
    </FieldContainer>
  </TouchableOpacity>
)

const EmptyField: React.FC = ({ children }) => {
  const { t } = useTranslation()
  const widgetContext = useWidget()
  if (!widgetContext?.onAdd) {
    throw new Error('No method provided for creating new attribute')
  }

  return (
    <TouchableOpacity onPress={widgetContext.onAdd} testID="widget-field-empty">
      <FieldContainer>
        {children ? (
          children
        ) : (
          <FieldText
            value={t('CredentialShare.attributeMissingValue')}
            color={Colors.error}
          />
        )}
      </FieldContainer>
    </TouchableOpacity>
  )
}

const FieldContainer: React.FC<IWithCustomStyle> = ({
  children,
  customStyles,
}) => <View style={[styles.field, customStyles]}>{children}</View>

const Field: React.FC & IFieldComposition = ({ children }) => (
  <View style={styles.container}>{children}</View>
)

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
