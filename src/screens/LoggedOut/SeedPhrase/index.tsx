import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native'
// @ts-ignore no typescript support as of yet
import RadialGradient from 'react-native-radial-gradient'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { TextStyle } from '~/utils/fonts'
import Paragraph from '~/components/Paragraph'
import { strings } from '~/translations/strings'
import useCircleHoldAnimation, { GestureState } from './useCircleHoldAnimation'
import { useMnemonic } from '~/hooks/sdk'
import { getEntropy } from '~/modules/account/selectors'
import { useSelector } from 'react-redux'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import { InfoIcon } from '~/assets/svg'

const SeedPhrase: React.FC = () => {
  const redirectToRepeatSeedPhrase = useRedirectTo(ScreenNames.SeedPhraseRepeat)
  const {
    gestureState,
    animationValues: { shadowScale, circleScale, shadowOpacity },
    gestureHandlers,
  } = useCircleHoldAnimation(1500)

  const [showInfo, setShowInfo] = useState(true)
  const [seedphrase, setSeedphrase] = useState('')
  const getMnemonic = useMnemonic()
  const entropy = useSelector(getEntropy)

  const infoOpacity = useRef<Animated.Value>(new Animated.Value(1)).current
  const buttonOpacity = useRef<Animated.Value>(new Animated.Value(0)).current

  useEffect(() => {
    const seedphrase = getMnemonic(entropy)
    setSeedphrase(seedphrase)
  }, [])

  useEffect(() => {
    switch (gestureState) {
      case GestureState.Start:
        setShowInfo(false)
        break
      case GestureState.End:
        setShowInfo(true)
        break
      case GestureState.Success:
        Animated.sequence([
          Animated.timing(shadowOpacity, {
            duration: 300,
            useNativeDriver: true,
            toValue: 0,
          }),
          Animated.delay(1000),
          Animated.timing(buttonOpacity, {
            duration: 400,
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

  const phraseOpacity = shadowScale.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0, 1],
  })

  const initialBackgroundOpacity = shadowScale.interpolate({
    inputRange: [0.82, 1],
    outputRange: [1, 0],
  })

  const finalBackgroundOpacity = shadowScale.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0.8, 1],
  })

  const renderBackgroundCrossfade = () => (
    <>
      <Animated.View
        style={[
          styles.wrapper,
          {
            backgroundColor: Colors.mainBlack,
            opacity: finalBackgroundOpacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wrapper,
          { backgroundColor: Colors.black, opacity: initialBackgroundOpacity },
        ]}
      />
    </>
  )

  const renderInfoIcon = () => (
    <Animated.View style={[styles.iconContainer, { opacity: phraseOpacity }]}>
      <TouchableOpacity>
        <InfoIcon />
      </TouchableOpacity>
    </Animated.View>
  )

  const renderSeedphrase = () => (
    <Animated.View
      style={[
        styles.seedphraseContainer,
        {
          opacity: gestureState === GestureState.Success ? 1 : phraseOpacity,
        },
      ]}
    >
      <Text
        style={[
          styles.seedphrase,
          gestureState !== GestureState.Success && styles.seedphraseShadow,
        ]}
      >
        {seedphrase}
      </Text>
    </Animated.View>
  )

  const renderMagicButton = () => (
    <Animated.View
      style={[
        {
          transform: [{ scaleX: shadowScale }, { scaleY: shadowScale }],
          opacity: shadowOpacity,
        },
      ]}
    >
      <RadialGradient
        style={styles.gradient}
        colors={[Colors.success, 'transparent']}
        stops={[0.4, 1]}
      />
      <Animated.View
        {...gestureHandlers}
        style={[
          styles.button,
          {
            transform: [{ scale: circleScale }],
          },
        ]}
      ></Animated.View>
    </Animated.View>
  )

  const renderMagicInfo = () => (
    <Animated.View style={[styles.info, { opacity: infoOpacity }]}>
      <Paragraph customStyles={styles.paragraph}>
        {strings.HOLD_YOUR_FINGER_ON_THE_CIRCLE}
      </Paragraph>
    </Animated.View>
  )

  const renderBottomButtons = () => (
    <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
      <Paragraph customStyles={{ marginBottom: 30, paddingHorizontal: 10 }}>
        {strings.WRITE_DOWN_THIS_PHRASE_SOMEWHERE_SAFE}
      </Paragraph>
      <Btn
        type={BtnTypes.primary}
        size={BtnSize.medium}
        onPress={redirectToRepeatSeedPhrase}
      >
        {strings.DONE}
      </Btn>
    </Animated.View>
  )

  return (
    <ScreenContainer isFullscreen backgroundColor={Colors.transparent}>
      {renderBackgroundCrossfade()}
      <ScreenContainer
        backgroundColor={Colors.transparent}
        customStyles={{ paddingBottom: 60 }}
      >
        {renderInfoIcon()}
        {renderSeedphrase()}
        <View style={styles.bottomContainer}>
          {renderMagicButton()}
          {renderMagicInfo()}
        </View>
        {renderBottomButtons()}
      </ScreenContainer>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  seedphrase: {
    ...TextStyle.seedPhrase,
    textAlign: 'center',
  },
  seedphraseShadow: {
    textShadowColor: Colors.white45,
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 18,
  },
  seedphraseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  bottomContainer: {
    flex: 0.4,
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: Platform.select({
      ios: 0,
      android: 10,
    }),
  },
  gradient: {
    width: 160,
    height: 160,
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.black,
    top: 30,
    left: 30,
    borderColor: Colors.success,
    borderWidth: Platform.select({
      ios: 1,
      android: 0.5,
    }),
  },
  info: {
    width: '80%',
  },
  buttonContainer: {
    width: '100%',
  },
  paragraph: {
    ...TextStyle.middleSubtitle,
  },
  iconContainer: {
    position: 'absolute',
    top: 30,
    right: 30,
  },
})

export default SeedPhrase
