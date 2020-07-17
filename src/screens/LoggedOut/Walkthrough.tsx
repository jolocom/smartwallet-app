import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import Swiper from 'react-native-swiper'

import Header, { HeaderSizes } from '~/components/Header'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import Btn, { BtnTypes } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import BtnGroup from '~/components/BtnGroup'

import { ScreenNames } from '~/types/screens'

import useRedirectTo from '~/hooks/useRedirectTo'
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

const Dot: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <View style={styles.dot}>
      <View style={active ? styles.activeDot : styles.inactiveDot} />
    </View>
  )
}
const Walkthrough: React.FC = () => {
  const redirectToEntropy = useRedirectTo(ScreenNames.Entropy)
  const redirectToRecovery = useRedirectTo(ScreenNames.Recovery)

  const renderPagination = (index: number, total: number) => {
    return (
      <View style={styles.dotContainer}>
        {[...Array(total)].map((_, key) => (
          <Dot key={key} active={index === key} />
        ))}
      </View>
    )
  }

  return (
    <>
      <Swiper
        loop
        autoplay
        autoplayTimeout={2}
        renderPagination={renderPagination}
      >
        {walkthroughData.map((slide, idx) => (
          <>
            <ImageBackground
              key={idx}
              style={styles.background}
              source={slide.background}
            />
            <AbsoluteBottom
              customStyles={{ ...styles.consistentContainer, bottom: 195 }}
            >
              <View style={styles.contentContainer}>
                <Header size={HeaderSizes.large} color={Colors.white90}>
                  {walkthroughData[idx].header}
                </Header>
                <Paragraph
                  size={ParagraphSizes.large}
                  color={Colors.white85}
                  customStyles={{ opacity: 0.8, marginTop: 12 }}
                >
                  {walkthroughData[idx].paragraph}
                </Paragraph>
              </View>
            </AbsoluteBottom>
          </>
        ))}
      </Swiper>
      <AbsoluteBottom customStyles={styles.consistentContainer}>
        <BtnGroup>
          <Btn onPress={redirectToEntropy}>{strings.GET_STARTED}</Btn>
          <Btn type={BtnTypes.secondary} onPress={redirectToRecovery}>
            {strings.NEED_RESTORE}
          </Btn>
        </BtnGroup>
      </AbsoluteBottom>
    </>
  )
}

const styles = StyleSheet.create({
  background: { ...(StyleSheet.absoluteFill as {}) },
  consistentContainer: {
    paddingHorizontal: '5%',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  dotContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 155,
  },
  dot: {
    width: 3,
    height: 3,
    marginHorizontal: 3.5,
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
