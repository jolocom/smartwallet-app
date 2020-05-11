import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import Swiper from 'react-native-swiper'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Btn, { BtnTypes } from '~/components/Btn'
import { ScreenNames } from '~/types/screens'

import useRedirectTo from '~/hooks/useRedirectTo'
import Paragraph from '~/components/Paragraph'
import {
  Walkthrough1,
  Walkthrough2,
  Walkthrough3,
  Walkthrough4,
} from '~/assets/images'
import { strings } from '~/translations/strings'

const walkthroughData = [
  {
    background: Walkthrough1,
    header: strings.BE_THE_ONLY_ONE,
    paragraph: strings.CONTROL_YOUR_OWN_PERSONAL_INFORMATION,
  },
  {
    background: Walkthrough2,
    header: strings.GET_WHERE_YOU_NEED_TO_GO,
    paragraph: strings.UNLOCK_DOORS,
  },
  {
    background: Walkthrough3,
    header: strings.NEVER_LOOSE_DATA,
    paragraph: strings.KEEP_ALL_YOUR_INFO_BACKED_UP,
  },
  {
    background: Walkthrough4,
    header: strings.PROOVE_YOURE_YOU,
    paragraph: strings.UNIQUE_DIGITAL_IDENTITY_TECHNOLOGY,
  },
]

const Walkthrough: React.FC = () => {
  const redirectToEntropy = useRedirectTo(ScreenNames.Entropy)
  const redirectToRecovery = useRedirectTo(ScreenNames.Recovery)

  const handlePagination = (index: number, total: number) => {
    const { header, paragraph } = walkthroughData[index]
    return (
      <View style={styles.textContainer}>
        <Header>{header}</Header>
        <Paragraph>{paragraph}</Paragraph>
      </View>
    )
  }

  return (
    <ScreenContainer isFullscreen>
      <Swiper loop autoplay renderPagination={handlePagination}>
        {walkthroughData.map((slide, key) => (
          <ImageBackground
            key={key}
            style={styles.background}
            source={slide.background}
          />
        ))}
      </Swiper>
      <View style={styles.buttonContainer}>
        <Btn onPress={redirectToEntropy}>{strings.GET_STARTED}</Btn>
        <Btn type={BtnTypes.secondary} onPress={redirectToRecovery}>
          {strings.NEED_RESTORE}
        </Btn>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    bottom: '30%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '5%',
    width: '100%',
    paddingHorizontal: '5%',
  },
})

export default Walkthrough
