import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import Swiper from 'react-native-swiper'
import { useSafeArea } from 'react-native-safe-area-context'

import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import BtnGroup from '~/components/BtnGroup'

import { ScreenNames } from '~/types/screens'

import { useRedirect } from '~/hooks/navigation'
import { Walkthrough1, Walkthrough2, Walkthrough3 } from '~/assets/images'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

const walkthroughData = [
  {
    background: Walkthrough1,
    header: strings.WALKTHROUGH_TITLE_STEP_1,
    paragraph: strings.WALKTHROUGH_DESCRIPTION_STEP_1,
  },
  {
    background: Walkthrough2,
    header: strings.WALKTHROUGH_TITLE_STEP_2,
    paragraph: strings.WALKTHROUGH_DESCRIPTION_STEP_2,
  },
  {
    background: Walkthrough3,
    header: strings.WALKTHROUGH_TITLE_STEP_3,
    paragraph: strings.WALKTHROUGH_DESCRIPTION_STEP_3,
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
  const redirect = useRedirect()

  const renderPagination = (index: number, total: number) => {
    return (
      <View style={styles.dotContainer}>
        {[...Array(total)].map((_, key) => (
          <Dot key={key} active={index === key} />
        ))}
      </View>
    )
  }

  const insets = useSafeArea()

  return (
    <ScreenContainer
      isFullscreen
      customStyles={{ marginTop: -insets.top }}
      backgroundColor={Colors.abbey}
    >
      <Swiper
        loop
        autoplay
        autoplayTimeout={5}
        renderPagination={renderPagination}
      >
        {walkthroughData.map((slide, idx) => (
          <React.Fragment key={slide.header + idx}>
            <ImageBackground
              key={idx}
              style={styles.background}
              source={slide.background}
            />
            <AbsoluteBottom
              customStyles={{
                ...styles.consistentContainer,
                bottom: 235,
              }}
            >
              <JoloText
                kind={JoloTextKind.title}
                size={JoloTextSizes.big}
                weight={JoloTextWeight.regular}
                color={Colors.white90}
              >
                {walkthroughData[idx].header}
              </JoloText>
              <JoloText
                kind={JoloTextKind.subtitle}
                size={JoloTextSizes.big}
                color={Colors.white80}
                customStyles={{ marginTop: 12 }}
              >
                {walkthroughData[idx].paragraph}
              </JoloText>
            </AbsoluteBottom>
          </React.Fragment>
        ))}
      </Swiper>
      <AbsoluteBottom customStyles={styles.consistentContainer}>
        <BtnGroup>
          <Btn
            size={BtnSize.large}
            onPress={() =>
              redirect(ScreenNames.Onboarding, {
                initialRoute: ScreenNames.Registration,
              })
            }
          >
            {strings.GET_STARTED}
          </Btn>
          <Btn
            size={BtnSize.large}
            type={BtnTypes.secondary}
            onPress={() =>
              redirect(ScreenNames.Onboarding, {
                initialRoute: ScreenNames.IdentityRecovery,
              })
            }
          >
            {strings.NEED_RESTORE}
          </Btn>
        </BtnGroup>
      </AbsoluteBottom>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  background: { ...(StyleSheet.absoluteFill as {}), top: -20 },
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
    bottom: 185,
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
