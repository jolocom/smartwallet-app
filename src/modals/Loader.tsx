import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Animated,
  StyleSheet,
  Modal,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native'
import { useSelector } from 'react-redux'

import Circle from '~/components/Circle'

import { getLoaderState } from '~/modules/loader/selectors'
import { Colors } from '~/utils/colors'
import { SuccessTick, ErrorIcon } from '~/assets/svg'
import { LoaderTypes } from '~/modules/loader/types'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { getIsAppLocked, isLocalAuthSet } from '~/modules/account/selectors'
import { JoloTextSizes } from '~/utils/fonts'

const colors = {
  default: Colors.white70,
  error: Colors.error,
  success: Colors.success,
}

interface LoaderI {
  bgColor?: Colors
}

const SCALE_MAX = 5
const CIRCLE_DIAMETER = 18

const Loader: React.FC<LoaderI> = ({ bgColor = Colors.black }) => {
  const { msg, type } = useSelector(getLoaderState)

  const [animating, setAnimating] = useState(true)

  useEffect(() => {
    return () => setAnimating(false)
  }, [])

  const animatedWidth1 = useRef(new Animated.Value(0)).current
  const animatedOpacity1 = animatedWidth1.interpolate({
    inputRange: [1, 4, SCALE_MAX],
    outputRange: [1, 0.3, 0],
  })

  const animatedWidth2 = useRef(new Animated.Value(0)).current
  const animatedOpacity2 = animatedWidth2.interpolate({
    inputRange: [0, 1.5, SCALE_MAX],
    outputRange: [0, 1, 0],
  })

  const animatedWidth3 = useRef(new Animated.Value(0)).current
  const animatedOpacity3 = animatedWidth3.interpolate({
    inputRange: [0, 1.5, SCALE_MAX],
    outputRange: [0, 1, 0],
  })

  const errorScale = useRef(new Animated.Value(0)).current
  const errorOpacity = errorScale.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const tickBlockerOpacity = useRef(new Animated.Value(0)).current
  const tickBlockerPosition = useRef(new Animated.Value(-3)).current
  const tickBlockerWidth = tickBlockerPosition.interpolate({
    inputRange: [0, 45],
    outputRange: [1, 0.1],
  })

  const animatedOpacity4 = useRef(new Animated.Value(0)).current

  const animateValueTo = (
    value: Animated.Value,
    toValue: number,
    duration: number,
  ) => {
    return Animated.timing(value, {
      toValue: toValue,
      duration: duration,
      useNativeDriver: true,
    })
  }

  const reset = Animated.parallel([
    animateValueTo(animatedWidth1, 0, 0),
    animateValueTo(animatedWidth2, 0, 0),
    animateValueTo(animatedWidth3, 0, 0),
  ])

  const fRipple = Animated.sequence([
    animateValueTo(animatedWidth1, 0.5, 0),
    animateValueTo(animatedWidth1, SCALE_MAX, 1500),
  ])

  const sRipple = Animated.sequence([
    Animated.delay(400),
    animateValueTo(animatedWidth2, SCALE_MAX, 2500),
  ])

  const tRipple = Animated.sequence([
    Animated.delay(1600),
    animateValueTo(animatedWidth3, SCALE_MAX, 2500),
  ])

  const ripple = Animated.loop(
    Animated.sequence([Animated.parallel([fRipple, sRipple, tRipple]), reset]),
  )

  const bounceError = () => {
    Animated.parallel([
      Animated.timing(animatedOpacity4, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(errorScale, {
        toValue: 1.5,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const showTick = () => {
    Animated.parallel([
      Animated.timing(animatedOpacity4, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.sequence([
        animateValueTo(tickBlockerOpacity, 1, 0),
        animateValueTo(tickBlockerPosition, 25, 700),
      ]),
    ]).start()
  }

  const looping = () => {
    console.log({ type })
    if (type === LoaderTypes.default) {
      ripple.start()
    } else if (type === LoaderTypes.error) {
      reset.start(ripple.stop)
      bounceError()
    } else if (type === LoaderTypes.success) {
      reset.start(ripple.stop)
      showTick()
    }
  }

  useEffect(() => {
    animating && looping()
  })

  // NOTE: @StatusBar component is here (aside from the one in @Overlays) b/c there is an issue
  // with translucent status bars and the @Modal component
  return (
    <Modal animationType="fade" visible presentationStyle="overFullScreen">
      <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
      <View style={[styles.modalBodyContainer, { backgroundColor: bgColor }]}>
        <View
          style={{
            width: 230,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
            }}
          >
            <Circle
              diameter={CIRCLE_DIAMETER}
              color={colors.default}
              animatedStyles={{
                transform: [{ scale: animatedWidth1 }],
                opacity: animatedOpacity1,
              }}
            />
            <Circle
              diameter={CIRCLE_DIAMETER}
              color={colors.default}
              animatedStyles={{
                transform: [{ scale: animatedWidth2 }],
                opacity: animatedOpacity2,
              }}
            />
            <Circle
              diameter={CIRCLE_DIAMETER}
              color={colors.default}
              animatedStyles={{
                transform: [{ scale: animatedWidth3 }],
                opacity: animatedOpacity3,
              }}
            />
            {type !== LoaderTypes.default && (
              <Circle
                diameter={(CIRCLE_DIAMETER - 4) * 5}
                thickness={StyleSheet.hairlineWidth * 5}
                color={colors.default}
                animatedStyles={{
                  opacity: animatedOpacity4,
                }}
              />
            )}
            {type === LoaderTypes.error && (
              <Animated.View
                style={{
                  position: 'absolute',
                  transform: [{ scale: errorScale }],
                  opacity: errorOpacity,
                  width: 18,
                  height: 18,
                }}
              >
                <ErrorIcon color={colors.default} />
              </Animated.View>
            )}
            {type === LoaderTypes.success && (
              <View style={styles.tickContainer}>
                <View style={{ position: 'absolute', width: 26, height: 26 }}>
                  <SuccessTick color={colors.default} />
                </View>
                <Animated.View
                  style={[
                    styles.tickBlocker,
                    {
                      backgroundColor: bgColor,
                      transform: [
                        { translateX: tickBlockerPosition },
                        { scale: tickBlockerWidth },
                      ],
                    },
                  ]}
                />
              </View>
            )}
          </View>

          <JoloText
            kind={JoloTextKind.subtitle}
            size={JoloTextSizes.middle}
            color={Colors.white70}
            customStyles={{ marginTop: 10 }}
          >
            {msg}
          </JoloText>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBodyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Dimensions.get('window').height * 0.3,
  },
  tickContainer: {
    width: 100,
    height: 50,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickBlocker: {
    height: '100%',
    width: 30,
  },
})

export default function () {
  const { isVisible: isLoaderVisible } = useSelector(getLoaderState)
  const isAuthSet = useSelector(isLocalAuthSet)
  const isAppLocked = useSelector(getIsAppLocked)

  // isVisible && isLocked && !isAuthSet => Logged out section
  if ((isLoaderVisible && !isAppLocked) || (isLoaderVisible && !isAuthSet)) {
    return <Loader />
  }
  return null
}
