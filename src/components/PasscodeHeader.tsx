import React from 'react'
import { View, StyleSheet } from 'react-native'
import Header from './Header'
import { Fonts } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

const PasscodeHeader: React.FC = ({ children }) => (
  <View style={styles.headerContainer}>
    <Header customStyles={{ fontFamily: Fonts.Regular }} color={Colors.white90}>
      {children}
    </Header>
  </View>
)

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
  },
})

export default PasscodeHeader
