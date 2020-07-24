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
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { TextStyle } from '~/utils/fonts'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { strings } from '~/translations/strings'
import useCircleHoldAnimation, { GestureState } from './useCircleHoldAnimation'
import { useMnemonic } from '~/hooks/sdk'
import { getEntropy } from '~/modules/account/selectors'
import { useSelector } from 'react-redux'
import { InfoIcon } from '~/assets/svg'
import AbsoluteBottom from '~/components/AbsoluteBottom'

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
      style={[
        {
          transform: [{ scaleX: shadowScale }, { scaleY: shadowScale }],
          opacity: magicOpacity,
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
    <AbsoluteBottom>
      <Animated.View style={[{ opacity: buttonOpacity }]}>
        <Paragraph
          size={ParagraphSizes.medium}
          customStyles={{ marginBottom: 30, paddingHorizontal: 10 }}
        >
          {strings.WRITE_DOWN_THIS_PHRASE_SOMEWHERE_SAFE}
        </Paragraph>
        <Btn
          type={BtnTypes.primary}
          size={BtnSize.medium}
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
    justifyContent: 'space-around',
  },
  helpersContainer: {
    flex: 0.4,
    width: '100%',
  },
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
      height: 1,
    },
    textShadowRadius: 10,
  },
  bottomContainer: {
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
  paragraph: {
    ...TextStyle.middleSubtitle,
  },
  iconContainer: {
    alignSelf: 'flex-end',
  },
})

export default SeedPhrase
