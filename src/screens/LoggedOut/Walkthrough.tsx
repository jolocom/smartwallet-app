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
import { Colors } from '~/utils/colors'

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

const Dot: React.FC<{ active: boolean }> = ({ active = false }) => {
  return (
    <View style={styles.dot}>
      <View style={[active ? styles.activeDot : styles.inactiveDot]} />
    </View>
  )
}

const WalkthroughButtons = React.memo(() => {
  const redirectToEntropy = useRedirectTo(ScreenNames.Entropy)
  const redirectToRecovery = useRedirectTo(ScreenNames.Recovery)

  return (
    <>
      <Btn onPress={redirectToEntropy}>{strings.GET_STARTED}</Btn>
      <Btn type={BtnTypes.secondary} onPress={redirectToRecovery}>
        {strings.NEED_RESTORE}
      </Btn>
    </>
  )
})

const Walkthrough: React.FC = () => {
  const handlePagination = (index: number, total: number) => {
    const { header, paragraph } = walkthroughData[index]
    return (
      <View style={styles.contentContainer}>
        <Header>{header}</Header>
        <Paragraph>{paragraph}</Paragraph>
        <View style={styles.dotContainer}>
          {[...Array(total)].map((_, key) => (
            <Dot key={key} active={index === key} />
          ))}
        </View>
        <WalkthroughButtons />
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
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'absolute',
    bottom: '5%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: '5%',
  },
  dotContainer: {
    width: 80,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  dot: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    backgroundColor: Colors.floralWhite,
    borderRadius: 35,
  },
  inactiveDot: {
    width: 3,
    height: 3,
    backgroundColor: Colors.peach,
    borderRadius: 35,
  },
})

export default Walkthrough
