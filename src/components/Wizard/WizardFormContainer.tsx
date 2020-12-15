import React from 'react'
import { StyleSheet, View } from 'react-native'

const WizardFormContainer: React.FC = ({ children }) => (
  <View style={styles.container} children={children} />
)

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    marginBottom: 18,
  },
})

export default WizardFormContainer
