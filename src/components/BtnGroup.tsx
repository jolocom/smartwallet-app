import React from 'react'
import { View, StyleSheet } from 'react-native'

const BtnGroup: React.FC = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
})

export default BtnGroup
