import React, { useEffect, useRef, useState } from 'react'
import { View, Animated, StyleSheet, Modal, Easing } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import Circle from '~/components/Circle'

import { getLoaderState } from '~/modules/loader/selectors'
import { Colors } from '~/utils/colors'
import { SuccessTick, ErrorIcon } from '~/assets/svg'
import { LoaderTypes } from '~/modules/loader/types'
import { dismissLoader } from '~/modules/loader/actions'
import { useDelay } from '~/hooks/generic'
import JoloText, { JoloTextKind } from '~/components/JoloText'

const colors = {
  default: Colors.white90,
  error: Colors.error,
  success: Colors.success,
}

interface LoaderI {
  bgColor?: Colors
}

const SECONDS = 500;
const SCALE_BREAK_POINT = 4;
const SCALE_MAX = 5;

const Loader: React.FC<LoaderI> = ({ bgColor = Colors.black95 }) => {
  const { msg, type } = useSelector(getLoaderState)
  const isAnimating = useRef(true)
  const dispatch = useDispatch()

  const loaderType = useRef(type)
  const loaderMsg = useRef(msg)
  const loaderColor = useRef(colors[loaderType.current])

  const [status, setStatus] = useState(msg)

  const animatedWidth1 = useRef(new Animated.Value(1)).current
  const animatedOpacity1 = animatedWidth1.interpolate({
    // inputRange: [1, 1.5, 5],
    // outputRange: [1, 1, 0],
    inputRange: [1, 4, 5],
    outputRange: [1, 0.3, 0],
  })

  const animatedWidth2 = useRef(new Animated.Value(0)).current
  const animatedOpacity2 = animatedWidth2.interpolate({
    inputRange: [0, 1.5, 5],
    outputRange: [0, 1, 0],
  })

  const animatedWidth3 = useRef(new Animated.Value(0)).current
  const animatedOpacity3 = animatedWidth3.interpolate({
    // inputRange: [2, 4.5, 5],
    // outputRange: [0, 1, 0],
    // inputRange: [2, 3.5, 5],
    // outputRange: [0, 1, 0],
    inputRange: [0, 1.5, 5],
    outputRange: [0, 1, 0],
  })

  const errorScale = useRef(new Animated.Value(0)).current
  const errorOpacity = errorScale.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const tickBlockerOpacity = useRef(new Animated.Value(0)).current
  const tickBlockerPosition = useRef(new Animated.Value(10)).current
  const tickBlockerWidth = tickBlockerPosition.interpolate({
    inputRange: [0, 45],
    outputRange: [1, 0.1],
  })

  const animatedOpacity4 = useRef(new Animated.Value(0)).current

  const animateValueTo = (value, toValue, duration) => {
    return Animated.timing(value, {
      toValue: toValue,
      duration: duration,
      useNativeDriver: true,
    })
  }

  const firstRipple = Animated.parallel([
    animateValueTo(animatedWidth1, 1, 0),
    animateValueTo(animatedWidth1, 5, 2500 - SECONDS * 2),
  ])

  // const secondRipple = Animated.sequence([
  //   animateValueTo(animatedWidth2, 1, 2000 - SECONDS * 2),
  //   animateValueTo(animatedWidth2, 5, 2000 - SECONDS),
  // ])
  const secondRipple = Animated.sequence([
    animateValueTo(animatedWidth2, 1, 2000 - SECONDS * 2),
    animateValueTo(animatedWidth2, 5, 2000 - SECONDS),
  ])

  const thirdRipple = Animated.sequence([
    // animateValueTo(animatedWidth3, 1, 2000),
    Animated.timing(animatedWidth3, {
      toValue: 1,
      // delay: 1500 - SECONDS * 2,
      delay: 1500 - SECONDS,
      duration: 1000,
      useNativeDriver: true,
    }),
    Animated.timing(animatedWidth3, {
      toValue: 5,
      // delay: 3000,
      duration: 1000,
      useNativeDriver: true,
    }),
  ])

  const reset = Animated.parallel([
    animateValueTo(animatedWidth1, 0, 0),
    animateValueTo(animatedWidth2, 0, 0),
    animateValueTo(animatedWidth3, 0, 0),
  ])

  const fRipple = Animated.sequence([
    Animated.timing(animatedWidth1, {
      toValue: SCALE_BREAK_POINT,
      duration: 1500,
      useNativeDriver: true,
      // easing: Easing.in(Easing.linear),
    }),
    Animated.timing(animatedWidth1, {
      toValue: SCALE_MAX,
      duration: 1000,
      useNativeDriver: true,
      // easing: Easing.in(Easing.linear),
    })
  ]) 

  const sRipple = Animated.sequence([
    Animated.delay(800),
    Animated.timing(animatedWidth2, {
      toValue: SCALE_BREAK_POINT,
      duration: 2500,
      useNativeDriver: true,
      // easing: Easing.in(Easing.linear),
    }),
    Animated.timing(animatedWidth2, {
      toValue: SCALE_MAX,
      duration: 1000,
      useNativeDriver: true,
      // easing: Easing.quad,
    })
  ])

  const tRipple = Animated.sequence([
    Animated.delay(2500),
    Animated.timing(animatedWidth3, {
      toValue: SCALE_BREAK_POINT,
      duration: 2500,
      useNativeDriver: true,
      // easing: Easing.in(Easing.linear),
    }),
    Animated.timing(animatedWidth3, {
      toValue: SCALE_MAX,
      duration: 1000,
      useNativeDriver: true,
      // easing: Easing.quad,
    })
  ])

  // const ripple = Animated.sequence([
  //   Animated.stagger(500, [firstRipple, secondRipple, thirdRipple]),
  //   Animated.delay(500),
  //   reset,
  // ])
  const ripple = Animated.sequence([
    Animated.parallel([
      fRipple,
      sRipple,
      tRipple
    ]),
    Animated.delay(500),
    reset,
  ])

  const bounceError = async () => {
    Animated.parallel([
      Animated.timing(animatedOpacity4, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(errorScale, {
        toValue: 1.5,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start()
    await useDelay(() => dispatch(dismissLoader()), 3000)
  }

  const showTick = async () => {
    Animated.parallel([
      Animated.timing(animatedOpacity4, {
        toValue: 1,
        duration: 0,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(tickBlockerOpacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(tickBlockerPosition, {
          toValue: 28,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
    await useDelay(() => dispatch(dismissLoader()), 3000)
  }

  const modalVisible = msg !== ''

  const looping = () => {
    if (loaderType.current === LoaderTypes.default) {
      Animated.loop(ripple, { iterations: 1 }).start(() => {
        if (loaderType.current === LoaderTypes.default) {
          looping()
        } else if (loaderType.current === LoaderTypes.error) {
          setStatus(loaderMsg.current)
          bounceError()
        } else if (loaderType.current === LoaderTypes.success) {
          setStatus(loaderMsg.current)
          showTick()
        }
      })
    } else if (loaderType.current === LoaderTypes.error) {
      bounceError()
    } else if (loaderType.current === LoaderTypes.success) {
      showTick()
    }
  }

  useEffect(() => {
    loaderType.current = type
    loaderMsg.current = msg
    loaderColor.current = colors[type]
    isAnimating.current && looping()
    return () => {
      isAnimating.current = false
    }
  })

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      presentationStyle="overFullScreen"
    >
      <View style={[styles.modalBodyContainer, { backgroundColor: bgColor }]}>
          {/* <View
            style={{
              position: 'relative',
              justifyContent: 'center',
              height: 160,
            }}
          ></View> */}
          <Circle
            diameter={18}
            bgColor={loaderColor.current}
            animatedStyles={{
              transform: [{ scale: animatedWidth1 }],
              opacity: animatedOpacity1,
            }}
          />
          <Circle
            diameter={18}
            bgColor={loaderColor.current}
            animatedStyles={{
              transform: [{ scale: animatedWidth2 }],
              opacity: animatedOpacity2,
            }}
          />
          <Circle
            diameter={18}
            bgColor={loaderColor.current}
            animatedStyles={{
              transform: [{ scale: animatedWidth3 }],
              opacity: animatedOpacity3,
            }}
          />
          {loaderType.current !== LoaderTypes.default && (
            <Circle
              // diameter={18}
              diameter={14}
              // bgColor={loaderColor.current}
              bgColor={colors.default}
              animatedStyles={{
                transform: [{ scale: 5 }],
                opacity: animatedOpacity4,
              }}
            />
          )}
          {loaderType.current === LoaderTypes.error && (
            <Animated.View
              style={{
                position: 'absolute',
                transform: [{ scale: errorScale }],
                opacity: errorOpacity,
              }}
            >
              <ErrorIcon color={colors.default} />
            </Animated.View>
          )}
          {loaderType.current === LoaderTypes.success && (
            <View style={styles.tickContainer}>
              <View style={{ position: 'absolute' }}>
                {/* <SuccessTick color={loaderColor.current}  /> */}
                <SuccessTick color={colors.default}  />
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
          {/* <JoloText kind={JoloTextKind.subtitle}>{status}</JoloText> */}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    // width: 50,
    width: 20,
  },
})

export default function () {
  const { isVisible } = useSelector(getLoaderState)
  if (isVisible) {
    return <Loader />
  }
  return null
}