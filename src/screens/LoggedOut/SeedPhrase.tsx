import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Animated,
  GestureResponderEvent,
} from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import SDK from '~/utils/SDK'
import { TextStyle } from '~/utils/fonts'

import RadialGradient from 'react-native-radial-gradient'
import Paragraph from '~/components/Paragraph'
import { strings } from '~/translations/strings'

const SeedPhrase: React.FC = () => {
  const redirectToRepeatSeedPhrase = useRedirectTo(ScreenNames.SeedPhraseRepeat)
  const seedphrase = SDK.getMnemonic()
  const [showPhrase, setShowPhrase] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [startTime, setStartTime] = useState(0)

  const shadowScale = useRef<Animated.Value>(new Animated.Value(0.8)).current
  const circleScale = useRef<Animated.Value>(new Animated.Value(1.2)).current
  const circleOpacity = useRef<Animated.Value>(new Animated.Value(1)).current
  const infoOpacity = useRef<Animated.Value>(new Animated.Value(1)).current
  const buttonOpacity = useRef<Animated.Value>(new Animated.Value(0)).current
  const ANIMATION_DURATION = 1500

  useEffect(() => {
    if (showPhrase) {
      Animated.sequence([
        Animated.timing(circleOpacity, {
          duration: 300,
          useNativeDriver: true,
          toValue: 0,
        }),
        Animated.timing(buttonOpacity, {
          duration: 400,
          useNativeDriver: true,
          toValue: 1,
        }),
      ]).start()
    }
  }, [showPhrase])

  useEffect(() => {
    Animated.timing(infoOpacity, {
      duration: 500,
      useNativeDriver: true,
      toValue: showInfo ? 1 : 0,
    }).start()
  }, [showInfo])

  const onGestureStart = (e: GestureResponderEvent) => {
    setStartTime(e.nativeEvent.timestamp)
    setShowInfo(false)
    Animated.parallel([
      Animated.timing(shadowScale, {
        duration: ANIMATION_DURATION,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(circleScale, {
        duration: ANIMATION_DURATION,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const onGestureEnd = () => {
    if (!showPhrase) setShowInfo(true)
    Animated.parallel([
      Animated.timing(shadowScale, {
        duration: 400,
        toValue: 0.8,
        useNativeDriver: true,
      }),
      Animated.timing(circleScale, {
        duration: 400,
        toValue: 1.2,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const onGestureHold = (e: GestureResponderEvent) => {
    if (e.nativeEvent.timestamp - startTime > ANIMATION_DURATION)
      setShowPhrase(true)
  }

  const phraseOpacity = shadowScale.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0, 1],
  })

  return (
    <ScreenContainer backgroundColor={Colors.black}>
      <Animated.View
        style={[
          styles.seedphraseContainer,
          { opacity: showPhrase ? 1 : phraseOpacity },
        ]}
      >
        <Text style={styles.seedphrase}>{seedphrase.join(' ')}</Text>
      </Animated.View>
      <View style={styles.bottomContainer}>
        <Animated.View
          style={[
            {
              transform: [{ scaleX: shadowScale }, { scaleY: shadowScale }],
              opacity: circleOpacity,
            },
          ]}
        >
          <RadialGradient
            style={styles.gradient}
            colors={[Colors.success, 'transparent']}
            stops={[0.4, 1]}
          >
            <Animated.View
              onTouchStart={onGestureStart}
              onTouchEnd={onGestureEnd}
              onTouchMove={onGestureHold}
              style={[
                styles.button,
                {
                  transform: [{ scaleX: circleScale }, { scaleY: circleScale }],
                },
              ]}
            ></Animated.View>
          </RadialGradient>
        </Animated.View>
        <Animated.View style={[styles.info, { opacity: infoOpacity }]}>
          <Paragraph>{strings.HOLD_YOUR_FINGER_ON_THE_CIRCLE}</Paragraph>
        </Animated.View>
      </View>
      <Animated.View
        style={[styles.buttonContainer, { opacity: buttonOpacity }]}
      >
        <Paragraph>
          {strings.WRITE_DOWN_THIS_PHRASE_ITS_VERY_IMPORTANT}
        </Paragraph>
        <View style={{ marginTop: 30 }}>
          <Btn
            type={BtnTypes.primary}
            size={BtnSize.medium}
            onPress={redirectToRepeatSeedPhrase}
          >
            {strings.OKAY}
          </Btn>
          <Btn
            type={BtnTypes.secondary}
            size={BtnSize.medium}
            onPress={() => null}
          >
            {strings.WHY_SO_ANALOGUE}
          </Btn>
        </View>
      </Animated.View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  seedphrase: {
    ...TextStyle.seedPhrase,
    textAlign: 'center',
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
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    paddingRight: 10,
    alignItems: 'flex-end',
  },
  gradient: {
    marginTop: '10%',
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 100,
    height: 100,
    backgroundColor: Colors.black,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: Colors.success,
  },
  info: {
    width: '80%',
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: '5%',
  },
})

export default SeedPhrase
