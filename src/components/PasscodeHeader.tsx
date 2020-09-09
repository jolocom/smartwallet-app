import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Fonts } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from './JoloText'

const PasscodeHeader: React.FC = ({ children }) => (
  <View style={styles.headerContainer}>
    <JoloText
      kind={JoloTextKind.title}
      size="middle"
      customStyles={{ fontFamily: Fonts.Regular }}
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
