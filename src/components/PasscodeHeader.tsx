import React from 'react'
import { View, StyleSheet } from 'react-native'
import Paragraph, { ParagraphSizes } from './Paragraph'

const PasscodeHeader: React.FC = ({ children }) => (
  <View style={styles.headerContainer}>
    <Paragraph size={ParagraphSizes.large}>{children}</Paragraph>
  </View>
)

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
  },
})

export default PasscodeHeader
