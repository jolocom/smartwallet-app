import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Colors } from './colors'

const Header: React.FC = ({ children }) => {
  return <Text style={styles.title}>{children}</Text>
}

const styles = StyleSheet.create({
  title: {
    color: Colors.white,
    fontSize: 20,
  },
})

export default Header
