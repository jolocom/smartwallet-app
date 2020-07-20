import React from 'react'
import { TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native'

import { Colors } from '~/utils/colors'
import Paragraph from '~/components/Paragraph'
import { strings } from '~/translations/strings'

export enum FieldTypes {
  isSelectable = 'isSelectable',
  isStatic = 'isStatic',
  isEmpty = 'isEmpty',
}

const Field = ({ type, value, isSelected, onSelect }) => {
  switch (type) {
    case FieldTypes.isSelectable:
      return (
        <TouchableWithoutFeedback onPress={onSelect}>
          <View style={styles.field}>
            <Paragraph>{value}</Paragraph>
            {isSelected ? (
              <View style={[styles.radio, styles.selected]} />
            ) : (
              <View style={[styles.radio, styles.notSelected]} />
            )}
          </View>
        </TouchableWithoutFeedback>
      )
    case 'isStatic':
      return (
        <View style={styles.field}>
          <Paragraph>{value}</Paragraph>
        </View>
      )
    case 'isEmpty':
      return (
        <TouchableOpacity style={styles.field}>
          <Paragraph color={Colors.error}>{strings.MISSING_INFO}*</Paragraph>
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
