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
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { Fonts, JoloTextSizes } from '~/utils/fonts'
import { strings } from '~/translations/strings'
import useCircleHoldAnimation, { GestureState } from './useCircleHoldAnimation'
import { useMnemonic } from '~/hooks/sdk'
import { getEntropy } from '~/modules/account/selectors'
import { useSelector } from 'react-redux'
import { InfoIcon } from '~/assets/svg'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import BP from '~/utils/breakpoints'

const vibrationOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
}

const SeedPhrase: React.FC = () => {
  const redirectToRepeatSeedPhrase = useRedirectTo(ScreenNames.SeedPhraseRepeat)
  const {
    gestureState,
    animationValues: { shadowScale, circleScale, magicOpacity },
    gestureHandlers,
  } = useCircleHoldAnimation(1200)

  const [showInfo, setShowInfo] = useState(true)
  const [seedphrase, setSeedphrase] = useState('')
  const getMnemonic = useMnemonic()
  const entropy = useSelector(getEntropy)

  const infoOpacity = useRef<Animated.Value>(new Animated.Value(1)).current
  const buttonOpacity = useRef<Animated.Value>(new Animated.Value(0)).current

  const phraseOpacity = shadowScale.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0, 1],
  })

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
        ReactNativeHapticFeedback.trigger('impactLight', vibrationOptions)
        Animated.parallel([
          Animated.timing(magicOpacity, {
            duration: 300,
            useNativeDriver: true,
            toValue: 0,
          }),
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

  const shadowAnimation = shadowScale.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0, 1],
  })

  const renderBackgroundCrossfade = () => (
    <>
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: Colors.mainBlack,
          },
        ]}
      />
      {gestureState !== GestureState.Success && (
        <Animated.View
          style={[
            styles.wrapper,
            {
              backgroundColor: Colors.black,
              opacity: initialBackgroundOpacity,
            },
          ]}
        />
      )}
    </>
  )

  const renderInfoIcon = () => (
    <Animated.View style={[styles.iconContainer, { opacity: buttonOpacity }]}>
      <TouchableOpacity>
        <InfoIcon />
      </TouchableOpacity>
    </Animated.View>
  )

  const renderSeedphrase = () => (
    <Animated.View
      style={{
        opacity: gestureState === GestureState.Success ? 1 : phraseOpacity,
        marginTop: 40,
      }}
    >
      <Text style={styles.seedphrase}>{seedphrase}</Text>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: '100%',
            height: '100%',
          },
          { opacity: shadowAnimation },
        ]}
      >
        <Text
          style={[
            styles.seedphrase,
            Platform.OS === 'android' && { color: Colors.transparent },
            styles.seedphraseShadow,
          ]}
        >
          {seedphrase}
        </Text>
      </Animated.View>
    </Animated.View>
  )

  const renderMagicButton = () => (
    <Animated.View
      {...gestureHandlers}
      style={[
        {
          transform: [{ scaleX: shadowScale }, { scaleY: shadowScale }],
          opacity: magicOpacity,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: circleScale }],
          },
        ]}
      ></Animated.View>
      <RadialGradient
        style={styles.gradient}
        colors={[Colors.success, 'transparent']}
        stops={[0.4, 1]}
      />
    </Animated.View>
  )

  const renderMagicInfo = () => (
    <Animated.View style={[styles.info, { opacity: infoOpacity }]}>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        color={Colors.white70}
        customStyles={{ opacity: 0.7 }}
      >
        {strings.HOLD_YOUR_FINGER_ON_THE_CIRCLE}
      </JoloText>
    </Animated.View>
  )

  const renderBottomButtons = () => (
    <AbsoluteBottom>
      <Animated.View style={[{ opacity: buttonOpacity }]}>
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.middle}
          color={Colors.white}
          customStyles={{ marginBottom: 10 }}
        >
          {strings.WRITE_DOWN_THIS_PHRASE_SOMEWHERE_SAFE}
        </JoloText>
        <Btn
          type={BtnTypes.primary}
          onPress={
            gestureState === GestureState.Success
              ? redirectToRepeatSeedPhrase
              : () => {}
          }
        >
          {strings.DONE}
        </Btn>
      </Animated.View>
    </AbsoluteBottom>
  )

  return (
    <>
      {renderBackgroundCrossfade()}
      <ScreenContainer backgroundColor={Colors.transparent}>
        {/* this should take 3/5 of a screen; justify-content: space-between */}
        <View style={styles.phraseContainer}>
          {renderInfoIcon()}
          {renderSeedphrase()}
        </View>
        {/* this should take 2/5 of a screen */}
        <View style={styles.helpersContainer}>
          <View style={styles.bottomContainer}>
            {renderMagicButton()}
            {renderMagicInfo()}
          </View>
          {renderBottomButtons()}
        </View>
      </ScreenContainer>
    </>
  )
}

const styles = StyleSheet.create({
  phraseContainer: {
    flex: 0.6,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  iconContainer: {
    alignSelf: 'flex-end',
  },
  seedphrase: {
    textAlign: 'center',
    fontFamily: Fonts.Medium,
    fontSize: BP({ default: 32, large: 40, medium: 40 }),
    lineHeight: BP({ default: 46, large: 54, medium: 54 }),
    letterSpacing: 0,
    color: Colors.activity,
  },
  seedphraseShadow: {
    textShadowColor: Colors.white45,
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 10,
  },
  helpersContainer: {
    flex: 0.4,
    width: '100%',
    justifyContent: 'flex-start',
  },
  info: {
    width: '40%',
    marginTop: 20,
  },
  wrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  bottomContainer: {
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  gradient: {
    width: 160,
    height: 160,
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'center',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.black,
    borderColor: Colors.success,
    borderWidth: Platform.select({
      ios: 1,
      android: 0.5,
    }),
    zIndex: 20,
  },
})

export default SeedPhrase
