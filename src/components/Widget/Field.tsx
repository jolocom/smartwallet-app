import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { PurpleTickSuccess } from '~/assets/svg'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useWidget } from '.'
import JoloText, { JoloTextKind } from '../JoloText'
import FieldInput from './FieldInput'

export type TField = IFieldComposition & React.FC

interface IFieldComposition {
  Input: React.FC
  Static: React.FC<Pick<IWidgetField, 'value'>>
  Selectable: React.FC<Pick<IWidgetField, 'id' | 'value' | 'isSelected'>>
  Empty: React.FC
}

export interface IWidgetField {
  id: string
  value: string
  isSelected: boolean
  color?: Colors
}

const FieldText: React.FC<Pick<IWidgetField, 'value' | 'color'>> = ({
  value,
  color = Colors.white90,
}) => {
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.middle}
      color={color}
    >
      {value}
    </JoloText>
  )
}

const StaticField: React.FC<Pick<IWidgetField, 'value'>> = ({ value }) => {
  return (
    <View style={styles.field}>
      <FieldText value={value} />
    </View>
  )
}

const SelectableField: React.FC<
  Pick<IWidgetField, 'id' | 'value' | 'isSelected'>
> = ({ id, value, isSelected }) => {
  const { onSelect, name } = useWidget()
  return (
    <TouchableWithoutFeedback onPress={() => onSelect(name, id)}>
      <View style={styles.field}>
        <FieldText value={value} />
        {isSelected ? (
          <View style={styles.radio}>
            <PurpleTickSuccess />
          </View>
        ) : (
          <View style={[styles.radio, styles.notSelected]} />
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const EmptyField: React.FC = () => {
  const { onCreate, name } = useWidget()

  return (
    <TouchableOpacity onPress={() => onCreate(name)}>
      <View style={styles.field}>
        <FieldText value={strings.MISSING_INFO} color={Colors.error} />
      </View>
    </TouchableOpacity>
  )
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
    borderRadius: 10,
  },
  notSelected: {
    borderColor: Colors.white45,
    opacity: 0.3,
    borderWidth: 1,
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
Field.Input = FieldInput
Field.Static = StaticField
Field.Selectable = SelectableField
Field.Empty = EmptyField

export default Field
