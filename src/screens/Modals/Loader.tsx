import React, { useEffect, useRef } from 'react'
import { BackHandler, View, Animated } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import ScreenContainer from '~/components/ScreenContainer'
import { dismissLoader } from '~/modules/loader/actions'

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

const Loader: React.FC = () => {
  const dispatch = useDispatch()
  const { msg, type } = useSelector(getLoaderState)

  const animatedScale1 = useRef(new Animated.Value(2)).current
  const animatedScale2 = useRef(new Animated.Value(0)).current
  const successAnimatedValue = useRef(new Animated.Value(1)).current
  const animatedOpacity1 = animatedScale1.interpolate({
    inputRange: [2, 6],
    outputRange: [1, 0],
  })
  const animatedOpacity2 = animatedScale2.interpolate({
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
        Animated.timing(animatedScale1, {
          toValue: 6,
          duration: 1700,
          useNativeDriver: true,
        }),
        Animated.timing(animatedScale1, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(animatedScale2, {
          toValue: 6,
          delay: 300,
          duration: 1700,
          useNativeDriver: true,
        }),
        Animated.timing(animatedScale2, {
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
          Animated.timing(animatedScale1, {
            duration: 1000,
            toValue: 6,
            useNativeDriver: true,
          }),
          Animated.timing(animatedScale2, {
            duration: 1000,
            toValue: 6,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        defaultAnimation.stop()
        // keep the loader for 2 sec before dismissing it
        setTimeout(() => {
          dispatch(dismissLoader())
        }, 2000)
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
        }}
      >
        <CircleIcon stroke={colors[type]} />
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
        }}
      >
        <CircleIcon stroke={colors[type]} />
      </Animated.View>
      <Paragraph size={ParagraphSizes.medium} color={colors[type]}>
        {msg}
      </Paragraph>
    </ScreenContainer>
  )
}

export default Loader
