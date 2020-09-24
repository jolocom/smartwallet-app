import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind, JoloTextWeight } from './JoloText'

const PasscodeHeader: React.FC = ({ children }) => (
  <View style={styles.headerContainer}>
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.middle}
      weight={JoloTextWeight.regular}
      color={Colors.white90}
    >
      {children}
    </JoloText>
  </View>
)

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
  },
})

export default PasscodeHeader
