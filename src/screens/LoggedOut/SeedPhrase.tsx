import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Animated,
  GestureResponderEvent,
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
import SDK from '~/utils/SDK'

enum GestureState {
  None,
  Start,
  End,
  Success,
}

const useCircleHoldAnimation = (animationDuration: number) => {
  const [startTime, setStartTime] = useState(0)
  const [gestureState, setGestureState] = useState<GestureState>(
    GestureState.None,
  )

  const shadowScale = useRef<Animated.Value>(new Animated.Value(0.8)).current
  const circleScale = useRef<Animated.Value>(new Animated.Value(1.2)).current
  const circleOpacity = useRef<Animated.Value>(new Animated.Value(1)).current

  const onTouchStart = (e: GestureResponderEvent) => {
    setStartTime(e.nativeEvent.timestamp)
    setGestureState(GestureState.Start)
    Animated.parallel([
      Animated.timing(shadowScale, {
        duration: animationDuration,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(circleScale, {
        duration: animationDuration,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const onTouchEnd = () => {
    if (gestureState !== GestureState.Success) setGestureState(GestureState.End)
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

  const onTouchMove = (e: GestureResponderEvent) => {
    if (e.nativeEvent.timestamp - startTime > animationDuration)
      setGestureState(GestureState.Success)
  }

  const gestureHandlers = { onTouchStart, onTouchEnd, onTouchMove }
  const animationValues = {
    shadowScale,
    circleScale,
    circleOpacity,
  }
  return {
    gestureState,
    animationValues,
    gestureHandlers,
  }
}

const SeedPhrase: React.FC = () => {
  const redirectToRepeatSeedPhrase = useRedirectTo(ScreenNames.SeedPhraseRepeat)
  const {
    gestureState,
    animationValues: { shadowScale, circleScale, circleOpacity },
    gestureHandlers,
  } = useCircleHoldAnimation(1500)
  const seedphrase = SDK.getMnemonic()
  const [showInfo, setShowInfo] = useState(true)

  const infoOpacity = useRef<Animated.Value>(new Animated.Value(1)).current
  const buttonOpacity = useRef<Animated.Value>(new Animated.Value(0)).current

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
          Animated.timing(circleOpacity, {
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

  return (
    <ScreenContainer backgroundColor={Colors.black}>
      <Animated.View
        style={[
          styles.seedphraseContainer,
          {
            opacity: gestureState === GestureState.Success ? 1 : phraseOpacity,
          },
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
              {...gestureHandlers}
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
          <Paragraph customStyles={styles.paragraph}>
            {strings.HOLD_YOUR_FINGER_ON_THE_CIRCLE}
          </Paragraph>
        </Animated.View>
      </View>
      <Animated.View
        style={[styles.buttonContainer, { opacity: buttonOpacity }]}
      >
        <View style={{ paddingHorizontal: '20%' }}>
          <Paragraph>
            {strings.WRITE_DOWN_THIS_PHRASE_ITS_VERY_IMPORTANT}
          </Paragraph>
        </View>
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
  paragraph: {
    opacity: 0.8,
    ...TextStyle.middleSubtitle,
  },
})

export default SeedPhrase
