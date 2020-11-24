import React from 'react'
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'

interface IFieldProps {
  customStyles?: StyleProp<TextStyle>
}

const Field: React.FC<TextProps & IFieldProps> = (props) => {
  const { children, customStyles, ...rest } = props
  return (
    <Text {...rest} style={[styles.text, customStyles]}>
      {children}
    </Text>
  )
}

export const TitleField: React.FC<TextProps & IFieldProps> = (props) => (
  <Field {...props} customStyles={[styles.titleField, props.customStyles]} />
)

export const SpecialField: React.FC<TextProps & IFieldProps> = (props) => (
  <Field {...props} customStyles={[styles.nameField, props.customStyles]} />
)

export const FieldName: React.FC<TextProps & IFieldProps> = (props) => (
  <Field {...props} customStyles={[styles.fieldName, props.customStyles]} />
)

export const FieldValue: React.FC<TextProps & IFieldProps> = (props) => (
  <Field {...props} customStyles={[styles.fieldValue, props.customStyles]} />
)

export const Highlight: React.FC<TextProps & IFieldProps> = (props) => (
  <Field {...props} customStyles={[styles.highlight, props.customStyles]} />
)

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
    fontFamily: Fonts.Regular,
  },
  fieldName: {
    fontSize: 16,
    lineHeight: 16,
    color: Colors.slateGray,
  },
  fieldValue: {
    fontSize: 20,
    lineHeight: 20,
    color: Colors.black,
    fontFamily: Fonts.Medium,
  },
  nameField: {
    color: Colors.black,
    fontFamily: Fonts.Medium,
    marginLeft: 10,
    fontSize: 20,
    lineHeight: 20,
  },
  titleField: {
    fontSize: 28,
    lineHeight: 28,
    marginBottom: 10,
  },
  highlight: {
    fontSize: 26,
    color: Colors.white90,
  },
})
