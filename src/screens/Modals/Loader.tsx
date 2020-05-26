import React, { useEffect, useRef } from 'react'
import { BackHandler, View, Animated, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import ScreenContainer from '~/components/ScreenContainer'

import { getLoaderState } from '~/modules/loader/selectors'
import { Colors } from '~/utils/colors'
import { SuccessTick, ErrorIcon } from '~/assets/svg'
import { LoaderTypes } from '~/modules/loader/types'
import useAnimatedCircles from '~/hooks/useAnimatedCircles'

const disableBackBtn = () => true

const colors = {
  default: Colors.white90,
  error: Colors.error,
  success: Colors.success,
}

const Loader: React.FC = () => {
  const { msg, type } = useSelector(getLoaderState)

  const {
    animatedScale1,
    animatedScale2,
    animatedOpacity1,
    animatedOpacity2,
    startScaling,
  } = useAnimatedCircles(2, 0, 6, 6, 1700)

  const successAnimatedValue = useRef(new Animated.Value(1)).current

  const successAnimatedOpacity = successAnimatedValue.interpolate({
    inputRange: [1, 1.5],
    outputRange: [0, 1],
  })
  const successRotate = successAnimatedValue.interpolate({
    inputRange: [1, 1.1, 1.4, 1.5],
    outputRange: ['0deg', '20deg', '-20deg', '0deg'],
  })

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      disableBackBtn,
    )
    return () => backHandler.remove()
  }, [])

  const scale = () => {
    if (type === LoaderTypes.default) {
      Animated.loop(startScaling).start()
    } else {
      Animated.parallel([
        Animated.spring(successAnimatedValue, {
          toValue: 1.5,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(animatedScale1, {
            toValue: 6,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        startScaling.stop()
      })
    }
  }

  useEffect(() => {
    scale()
  })

  return (
    <ScreenContainer isTransparent>
      <View style={{ position: 'relative', height: 200 }}></View>
      <Animated.View
        style={{
          position: 'absolute',
          transform: [{ scale: animatedScale1 }],
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
          transform: [
            { scale: successAnimatedValue },
            { rotate: successRotate },
          ],
          opacity: successAnimatedOpacity,
        }}
      >
        {type === LoaderTypes.success && <SuccessTick />}
        {type === LoaderTypes.error && <ErrorIcon />}
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          transform: [{ scale: animatedScale2 }],
          opacity: animatedOpacity2,
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: colors[type],
        }}
      >
        <View style={styles.nestedCircle} />
      </Animated.View>
      <Paragraph size={ParagraphSizes.medium} color={colors[type]}>
        {msg}
      </Paragraph>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  circle: {
    borderWidth: 1,
    position: 'absolute',
  },
  nestedCircle: {
    position: 'absolute',
    top: 1,
    left: 1,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.black,
  },
})

export default Loader
