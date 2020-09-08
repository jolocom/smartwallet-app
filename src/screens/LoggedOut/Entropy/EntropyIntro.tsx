import React from 'react'
import { View, StyleSheet } from 'react-native'

import { HandAnimation } from '~/components/HandAnimation'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '~/components/JoloText'

export const EntropyIntro: React.FC = () => {
  return (
    <View style={styles.container}>
      <HandAnimation />
      <View style={styles.textContainer}>
        <JoloText kind={JoloTextKind.title} size="middle">
          {strings.SET_UP_YOUR_IDENTITY}
        </JoloText>
        <JoloText
          kind={JoloTextKind.subtitle}
          size="middle"
          color={Colors.white70}
          customStyles={{ opacity: 0.8 }}
        >
          {strings.TAP_THE_SCREEN_AND_DRAW_RANDOMLY_ON_IT_UNTIL_YOU_COLLECT_100}
        </JoloText>
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
