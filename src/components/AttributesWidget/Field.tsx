import React from 'react'
import {
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native'

import { Colors } from '~/utils/colors'
import Paragraph from '~/components/Paragraph'
import { strings } from '~/translations/strings'
import { PurpleTickSuccess } from '~/assets/svg'

export enum FieldTypes {
  isSelectable = 'isSelectable',
  isStatic = 'isStatic',
  isEmpty = 'isEmpty',
}

interface SelectableFieldI {
  onCreateNewOne: (e: GestureResponderEvent) => void
  type: FieldTypes.isSelectable
  value: string
  isSelected: boolean
  onSelect: (e: GestureResponderEvent) => void
}

interface StaticFieldI {
  onCreateNewOne: (e: GestureResponderEvent) => void
  type: FieldTypes.isStatic
  value: string
  isSelected?: never
  onSelect?: never
}

interface EmptyFieldI {
  onCreateNewOne: (e: GestureResponderEvent) => void
  type: FieldTypes.isEmpty
  value?: never
  isSelected?: never
  onSelect?: never
}

const Field: React.FC<EmptyFieldI | SelectableFieldI | StaticFieldI> = ({
  type,
  value,
  isSelected,
  onSelect,
  onCreateNewOne,
}) => {
  switch (type) {
    case FieldTypes.isSelectable:
      return (
        <TouchableWithoutFeedback onPress={onSelect}>
          <View style={styles.field as ViewStyle}>
            <Paragraph>{value}</Paragraph>
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
    case FieldTypes.isStatic:
      return (
        <View style={styles.field as ViewStyle}>
          <Paragraph>{value}</Paragraph>
        </View>
      )
    case FieldTypes.isEmpty:
      return (
        <TouchableOpacity onPress={onCreateNewOne}>
          <View style={styles.field as ViewStyle}>
            <Paragraph color={Colors.error}>{strings.MISSING_INFO}*</Paragraph>
          </View>
        </TouchableOpacity>
      )
    default:
      return null
  }
}

const styles = {
  field: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 23,
    backgroundColor: Colors.black,
    borderRadius: 8,
    height: 50,
    marginVertical: 4,
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
  selected: {
    backgroundColor: Colors.success,
  },
}

export default Field
