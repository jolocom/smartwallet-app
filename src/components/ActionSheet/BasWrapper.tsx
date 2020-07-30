import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'

const BasWrapper: React.FC = ({ children }) => (
  <View style={styles.wrapper}>{children}</View>
)

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: Colors.black,
    borderRadius: 20,
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingTop: 55,
  },
})

export default BasWrapper
