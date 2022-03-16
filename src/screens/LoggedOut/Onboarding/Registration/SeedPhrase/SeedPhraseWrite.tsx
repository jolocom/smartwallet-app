import React, { useRef, useState, useEffect } from 'react'
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { useSafeArea } from 'react-native-safe-area-context'

import Btn, { BtnTypes } from '~/components/Btn'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import useCircleHoldAnimation, { GestureState } from './useCircleHoldAnimation'
import { InfoIcon } from '~/assets/svg'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import MagicButton from '~/components/MagicButton'
import WordPill from './components/WordPill'
import { useGetSeedPhrase } from '~/hooks/sdk'
import useTranslation from '~/hooks/useTranslation'
import { useDisableScreenshots } from '~/hooks/screenshots'
import ScreenContainer from '~/components/ScreenContainer'
import BP from '~/utils/breakpoints'
import { SCREEN_HEIGHT } from '~/utils/dimensions'
import AbsoluteBottom from '~/components/AbsoluteBottom'

const vibrationOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
}

const SeedPhraseWrite: React.FC = () => {
  const { t } = useTranslation()
  const { top } = useSafeArea()
  const redirect = useRedirect()
  const {
    gestureState,
    animationValues: { shadowScale, circleScale, magicOpacity },
    animateVaues: { hideMagicBtn },
    gestureHandlers,
  } = useCircleHoldAnimation(1200)
  const [showInfo, setShowInfo] = useState(true)
  const seedPhrase = useGetSeedPhrase()

  useDisableScreenshots()

  const infoOpacity = useRef<Animated.Value>(new Animated.Value(1)).current
  const buttonOpacity = useRef<Animated.Value>(new Animated.Value(0)).current

  const phraseOpacity = shadowScale.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0, 1],
  })

  useEffect(() => {
    switch (gestureState) {
      case GestureState.Start:
        setShowInfo(false)
        break
      case GestureState.End:
        setShowInfo(true)
        break
      case GestureState.Success:
        ReactNativeHapticFeedback.trigger('impactLight', vibrationOptions)
        Animated.parallel([
          hideMagicBtn,
          Animated.timing(buttonOpacity, {
            duration: 200,
            useNativeDriver: true,
            toValue: 1,
          }),
        ]).start()
        break
      default:
        break
    }
  }, [gestureState])

  useEffect(() => {
    Animated.timing(infoOpacity, {
      duration: 200,
      useNativeDriver: true,
      toValue: showInfo ? 1 : 0,
    }).start()
  }, [showInfo])

  const initialBackgroundOpacity = shadowScale.interpolate({
    inputRange: [0.85, 1],
    outputRange: [1, 0],
  })

  const renderSeedphrase = () => (
    <Animated.View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        opacity: gestureState === GestureState.Success ? 1 : phraseOpacity,
      }}
    >
      {seedPhrase.split(' ').map((w) => (
        <WordPill.Write key={w}>{w}</WordPill.Write>
      ))}
    </Animated.View>
  )

  const renderMagicButton = () => (
    <MagicButton
      gestureHandlers={gestureHandlers}
      animatedValues={{ shadowScale, circleScale, magicOpacity }}
    />
  )

  const renderMagicInfo = () => (
    <Animated.View style={[styles.info, { opacity: infoOpacity }]}>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        color={Colors.white70}
        customStyles={{ opacity: 0.7 }}
      >
        {t('SeedphraseWrite.touchInstructions')}
      </JoloText>
    </Animated.View>
  )

  const renderCTABtn = () => (
    <Animated.View style={{ opacity: buttonOpacity }}>
      <Btn
        type={BtnTypes.primary}
        disabled={gestureState !== GestureState.Success}
        onPress={() => {
          if (gestureState === GestureState.Success) {
            redirect(ScreenNames.SeedPhraseRepeat)
          }
        }}
      >
        {t('SeedphraseWrite.confirmBtn')}
      </Btn>
    </Animated.View>
  )

  const handleClarifySeedPhrase = () => {
    redirect(ScreenNames.GlobalModals, {
      screen: ScreenNames.SeedPhraseInfo,
    })
  }
  return (
    <>
      {/*This is an overlay screen*/}
      <Animated.View
        style={{
          position: 'absolute',
          justifyContent: 'flex-end',
          width: '100%',
          height: SCREEN_HEIGHT,
          zIndex: gestureState !== GestureState.Success ? 100 : 0,
          backgroundColor: Colors.black,
          opacity: initialBackgroundOpacity,
        }}
      >
        <View
          style={{
            alignSelf: 'flex-end',
            marginBottom: 150,
            marginRight: 20,
          }}
        >
          {renderMagicButton()}
          {renderMagicInfo()}
        </View>
      </Animated.View>
      {/*This is actual screen with the seedPhrase*/}
      <>
        {/* TODO: ScreenContainer header should support custom left/right headers*/}
        <View style={[styles.floatingQuestion, { top: top + 5 }]}>
          <TouchableOpacity onPress={handleClarifySeedPhrase}>
            <InfoIcon />
          </TouchableOpacity>
        </View>
        <ScreenContainer
          hasHeaderBack
          navigationStyles={{
            backgroundColor: Colors.mainBlack,
          }}
          customStyles={{
            justifyContent: 'flex-start',
            backgroundColor: Colors.mainBlack,
          }}
        >
          <JoloText
            weight={JoloTextWeight.medium}
            customStyles={{ marginTop: 8, paddingHorizontal: 36 }}
          >
            {t('SeedphraseWrite.writeInstructions')}
          </JoloText>
          <JoloText
            weight={JoloTextWeight.medium}
            customStyles={{
              color: Colors.success,
              marginTop: 8,
              paddingHorizontal: 36,
            }}
            color={Colors.success}
          >
            {t('SeedphraseWrite.writeInstructionsWarning')}
          </JoloText>
          <View style={styles.phraseContainer}>{renderSeedphrase()}</View>
          <AbsoluteBottom>{renderCTABtn()}</AbsoluteBottom>
        </ScreenContainer>
      </>
    </>
  )
}

const styles = StyleSheet.create({
  phraseContainer: {
    marginTop: BP({ default: 20, small: 10, xsmall: 10 }),
  },
  info: {
    width: '40%',
    marginTop: 20,
  },
  floatingQuestion: {
    position: 'absolute',
    right: 12,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default SeedPhraseWrite
