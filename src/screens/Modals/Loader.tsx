import React, { useEffect, useRef } from 'react'
import { BackHandler, View, Animated } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import ScreenContainer from '~/components/ScreenContainer'
import { dismissLoader } from '~/modules/loader/actions'

import Btn, { BtnTypes } from '~/components/Btn'
import { getLoaderState } from '~/modules/loader/selectors'
import { Colors } from '~/utils/colors'
import { CircleIcon } from '~/assets/svg'

const disableBackBtn = () => true

const colors = {
  default: Colors.white90,
  error: Colors.error,
  success: Colors.success,
}

const Loader: React.FC = () => {
  const dispatch = useDispatch()
  const { msg, type } = useSelector(getLoaderState)

  const animatedScale1 = useRef(new Animated.Value(1)).current
  const animatedScale2 = useRef(new Animated.Value(0)).current
  const animatedOpacity1 = animatedScale1.interpolate({
    inputRange: [1, 5],
    outputRange: [1, 0],
  })
  const animatedOpacity2 = animatedScale2.interpolate({
    inputRange: [0, 5],
    outputRange: [1, 0],
  })

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      disableBackBtn,
    )
    return () => backHandler.remove()
  }, [])

  const scale = () => {
    Animated.stagger(300, [
      Animated.timing(animatedScale1, {
        toValue: 5,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale2, {
        toValue: 5,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animatedScale1.setValue(0)
      animatedScale2.setValue(0)
      scale()
    })
  }

  useEffect(() => {
    scale()
  })

  const closeLoaderModal = () => {
    dispatch(dismissLoader())
  }

  return (
    <ScreenContainer isTransparent>
      <Btn type={BtnTypes.secondary} onPress={closeLoaderModal}>
        Close
      </Btn>
      <View style={{ position: 'relative', height: 200 }}></View>
      <Animated.View
        style={{
          position: 'absolute',
          transform: [{ scale: animatedScale1 }],
          opacity: animatedOpacity1,
        }}
      >
        <CircleIcon stroke={Colors.success} />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          transform: [{ scale: animatedScale2 }],
          opacity: animatedOpacity2,
        }}
      >
        <CircleIcon stroke={Colors.disco} />
      </Animated.View>
      <Paragraph size={ParagraphSizes.medium} color={colors[type]}>
        {msg}
      </Paragraph>
    </ScreenContainer>
  )
}

export default Loader
