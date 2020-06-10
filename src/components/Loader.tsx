import React, { useEffect, useRef, useState } from 'react'
import { View, Animated, StyleSheet, Modal, Easing } from 'react-native'
import { useSelector } from 'react-redux'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import ScreenContainer from '~/components/ScreenContainer'
import Circle from '~/components/Circle'

import { getLoaderState } from '~/modules/loader/selectors'
import { Colors } from '~/utils/colors'
import { SuccessTick, ErrorIcon } from '~/assets/svg'
import { LoaderTypes } from '~/modules/loader/types'
import useAnimatedCircles from '~/hooks/useAnimatedCircles'

const colors = {
  default: Colors.white90,
  error: Colors.error,
  success: Colors.success,
}

interface LoaderI {
  bgColor?: Colors
}

const Loader: React.FC<LoaderI> = ({ bgColor = Colors.black95 }) => {
  const { msg, type } = useSelector(getLoaderState)
  const isAnimating = useRef(true)

  const loaderType = useRef(type)
  const loaderMsg = useRef(msg)
  const loaderColor = useRef(colors[loaderType.current])

  const [status, setStatus] = useState(msg)

  const animatedWidth1 = useRef(new Animated.Value(0)).current
  const animatedOpacity1 = animatedWidth1.interpolate({
    inputRange: [1, 2, 5],
    outputRange: [1, 0.6, 0],
  })

  const animatedWidth2 = useRef(new Animated.Value(0)).current
  const animatedOpacity2 = animatedWidth2.interpolate({
    inputRange: [0, 1.5, 5],
    outputRange: [0, 1, 0],
  })

  const animatedWidth3 = useRef(new Animated.Value(0)).current
  const animatedOpacity3 = animatedWidth3.interpolate({
    inputRange: [2, 4.5, 5],
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

  const firstRipple = Animated.parallel([
    Animated.timing(animatedWidth1, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }),
    Animated.timing(animatedWidth1, {
      toValue: 5,
      duration: 3500,
      useNativeDriver: true,
    }),
  ])

  const secondRipple = Animated.sequence([
    Animated.timing(animatedWidth2, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }),
    Animated.timing(animatedWidth2, {
      toValue: 5,
      duration: 2000,
      useNativeDriver: true,
    }),
  ])

  const thirdRipple = Animated.sequence([
    Animated.timing(animatedWidth3, {
      toValue: 2,
      duration: 0,
      useNativeDriver: true,
    }),
    Animated.timing(animatedWidth3, {
      toValue: 4.5,
      delay: 3000,
      duration: 1000,
      useNativeDriver: true,
    }),
    Animated.timing(animatedWidth3, {
      toValue: 5,
      delay: 500,
      duration: 500,
      useNativeDriver: true,
    }),
  ])

  const reset = Animated.parallel([
    Animated.timing(animatedWidth1, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }),
    Animated.timing(animatedWidth2, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }),
    Animated.timing(animatedWidth3, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }),
  ])

  const ripple = Animated.sequence([
    Animated.stagger(500, [firstRipple, secondRipple, thirdRipple]),
    Animated.delay(1000),
    reset,
  ])

  const bounceError = () =>
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

  const showTick = () =>
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
        <ScreenContainer isTransparent>
          <View
            style={{
              position: 'relative',
              justifyContent: 'center',
              height: 160,
            }}
          ></View>
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
              diameter={18}
              bgColor={loaderColor.current}
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
              <ErrorIcon />
            </Animated.View>
          )}
          {loaderType.current === LoaderTypes.success && (
            <View style={styles.tickContainer}>
              <View style={{ position: 'absolute' }}>
                <SuccessTick />
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
          <Paragraph size={ParagraphSizes.medium} color={loaderColor.current}>
            {status}
          </Paragraph>
        </ScreenContainer>
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
    width: 50,
  },
})

export default function () {
  const { isVisible } = useSelector(getLoaderState)
  if (isVisible) {
    return <Loader />
  }
  return null
}
