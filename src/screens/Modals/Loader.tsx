import React, { useEffect, useRef } from 'react'
import { BackHandler, View, Animated, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import ScreenContainer from '~/components/ScreenContainer'

import { getLoaderState } from '~/modules/loader/selectors'
import { Colors } from '~/utils/colors'
import { CircleIcon, SuccessTick, ErrorIcon } from '~/assets/svg'
import { LoaderTypes } from '~/modules/loader/types'

const disableBackBtn = () => true

const colors = {
  default: Colors.white90,
  error: Colors.error,
  success: Colors.success,
}

type CircleProps = {
  color: Colors
  width: number
}

const Circle: React.FC<CircleProps> = ({
  animatedStyles,
  width = 25,
  color,
}) => {
  return (
    <Animated.View
      style={[
        styles.circle,
        animatedStyles,
        {
          width: width,
          height: width,
          borderRadius: width / 2,
          borderColor: color,
        },
      ]}
    />
  )
}

const Loader: React.FC = () => {
  const { msg, type } = useSelector(getLoaderState)

  const animatedWidth1 = useRef(new Animated.Value(2)).current
  const animatedWidth2 = useRef(new Animated.Value(0)).current
  const successAnimatedValue = useRef(new Animated.Value(1)).current
  const animatedOpacity1 = animatedWidth1.interpolate({
    inputRange: [2, 6],
    outputRange: [1, 0],
  })
  const animatedOpacity2 = animatedWidth2.interpolate({
    inputRange: [2, 6],
    outputRange: [1, 0],
  })
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
    const defaultAnimation = Animated.parallel([
      Animated.sequence([
        Animated.timing(animatedWidth1, {
          toValue: 6,
          duration: 1700,
          useNativeDriver: true,
        }),
        Animated.timing(animatedWidth1, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(animatedWidth2, {
          toValue: 6,
          delay: 700,
          duration: 1700,
          useNativeDriver: true,
        }),
        Animated.timing(animatedWidth2, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ])
    if (type === LoaderTypes.default) {
      Animated.loop(defaultAnimation).start()
    } else {
      Animated.parallel([
        Animated.spring(successAnimatedValue, {
          toValue: 1.5,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(animatedWidth1, {
            toValue: 6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedWidth1, {
            toValue: 6,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        defaultAnimation.stop()
      })
    }
  }

  useEffect(() => {
    scale()
  })

  return (
    <ScreenContainer isTransparent>
      <View style={{ position: 'relative', height: 200 }}></View>
      <Circle
        animatedStyles={{
          transform: [{ scale: animatedWidth1 }],
          opacity: animatedOpacity1,
        }}
        color={colors[type]}
      />
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
      <Circle
        animatedStyles={{
          transform: [{ scale: animatedWidth2 }],
          opacity: animatedOpacity2,
        }}
        color={colors[type]}
      />
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
})

export default Loader
