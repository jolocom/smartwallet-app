import React, { useEffect, useRef, useState } from 'react'
import { View, Animated, StyleSheet, Modal, Easing } from 'react-native'
import { useSelector } from 'react-redux'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import ScreenContainer from '~/components/ScreenContainer'

import { getLoaderState } from '~/modules/loader/selectors'
import { Colors } from '~/utils/colors'
import { SuccessTick, ErrorIcon } from '~/assets/svg'
import { LoaderTypes } from '~/modules/loader/types'

const colors = {
  default: Colors.white90,
  error: Colors.error,
  success: Colors.success,
}

const Loader: React.FC = () => {
  const { msg, type } = useSelector(getLoaderState)
  const isAnimating = useRef(true)

  const loaderType = useRef(type)
  const loaderMsg = useRef(msg)

  const [status, setStatus] = useState(msg)

  const animatedWidth1 = useRef(new Animated.Value(0)).current
  const animatedOpacity1 = animatedWidth1.interpolate({
    inputRange: [1, 5, 7],
    outputRange: [1, 0.6, 0],
  })

  const animatedWidth2 = useRef(new Animated.Value(0)).current
  const animatedOpacity2 = animatedWidth2.interpolate({
    inputRange: [0, 2, 7],
    outputRange: [0, 1, 0],
  })

  const animatedWidth3 = useRef(new Animated.Value(0)).current
  const animatedOpacity3 = animatedWidth3.interpolate({
    inputRange: [2, 7],
    outputRange: [0, 1],
  })

  const errorScale = useRef(new Animated.Value(0)).current
  const errorOpacity = errorScale.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const bounceError = () =>
    Animated.timing(errorScale, {
      toValue: 1.5,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start()

  const firstRipple = Animated.parallel([
    Animated.timing(animatedWidth1, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }),
    Animated.timing(animatedWidth1, {
      toValue: 7,
      duration: 3500,
      useNativeDriver: true,
    }),
  ])

  const secondRipple = Animated.sequence([
    Animated.timing(animatedWidth2, {
      toValue: 2,
      duration: 2000,
      useNativeDriver: true,
    }),
    Animated.timing(animatedWidth2, {
      toValue: 7,
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
      toValue: 7,
      delay: 3000,
      duration: 1500,
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

  const modalVisible = msg !== ''

  const looping = () => {
    Animated.loop(ripple, { iterations: 1 }).start(() => {
      if (loaderType.current === LoaderTypes.default) {
        looping()
      } else if (loaderType.current === LoaderTypes.error) {
        setStatus(loaderMsg.current)
        bounceError()
      }
    })
  }

  useEffect(() => {
    loaderType.current = type
    loaderMsg.current = msg
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
      <View style={styles.modalBodyContainer}>
        <ScreenContainer isTransparent>
          <View style={{ position: 'relative', height: 200 }}></View>
          <Animated.View
            style={{
              position: 'absolute',
              transform: [{ scale: animatedWidth1 }],
              opacity: animatedOpacity1,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors[type],
            }}
          >
            {/*  the border of the circle once is scaled get pixelated
        therefore drawing 2 circles to avoid border pixelation
        one inside of the other
        the outer has a background color depending on the Loader type
        the inner circle is of the color of the screen */}
            <View style={styles.nestedCircle} />
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              transform: [{ scale: animatedWidth2 }],
              opacity: animatedOpacity2,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors[type],
            }}
          >
            <View style={styles.nestedCircle} />
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              transform: [{ scale: animatedWidth3 }],
              opacity: animatedOpacity3,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors[type],
            }}
          >
            <View style={styles.nestedCircle} />
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              transform: [{ scale: errorScale }],
              opacity: errorOpacity,
            }}
          >
            <ErrorIcon />
          </Animated.View>
          <Paragraph size={ParagraphSizes.medium} color={colors[type]}>
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
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  circle: {
    borderWidth: 1,
    position: 'absolute',
  },
  nestedCircle: {
    position: 'absolute',
    top: 0.5,
    left: 0.5,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: Colors.black,
  },
})

export default function () {
  const { isVisible } = useSelector(getLoaderState)
  if (isVisible) {
    return <Loader />
  }
  return null
}
