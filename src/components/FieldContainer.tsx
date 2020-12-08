// TODO: rename this file
// it is used inside Widget, Form

import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const FieldContainer: React.FC = ({ children }) => {
  return <View style={styles.field}>{children}</View>
}

const styles = StyleSheet.create({
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

export default FieldContainer
