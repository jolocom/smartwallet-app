import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Colors } from './colors'

const PasscodeHeader: React.FC = ({ children }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.title}>{children}</Text>
  </View>
)

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    color: Colors.white,
    fontSize: 20,
  },
})

export default PasscodeHeader
