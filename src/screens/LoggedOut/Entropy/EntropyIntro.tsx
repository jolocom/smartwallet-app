import React from 'react'
import { View, StyleSheet } from 'react-native'

import { HandAnimation } from './HandAnimation'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'

export const EntropyIntro: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.handContainer}>
        <HandAnimation />
      </View>
      <View style={styles.textContainer}>
        <Header color={Colors.white85}>{strings.SET_UP_YOUR_IDENTITY}</Header>
        <Paragraph
          size={ParagraphSizes.medium}
          color={Colors.white70}
          customStyles={styles.paragraph}
        >
          {strings.TAP_THE_SCREEN_AND_DRAW_RANDOMLY_ON_IT_UNTIL_YOU_COLLECT_100}
        </Paragraph>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  handContainer: {
    margin: 60,
    width: 78,
    height: 84,
  },
  textContainer: {
    alignItems: 'center',
  },
  paragraph: {
    opacity: 0.8,
    paddingHorizontal: 20,
  },
})
