import React, { useEffect, useRef } from 'react'
import { BackHandler, View, Animated, StyleSheet, Modal } from 'react-native'
import { useSelector } from 'react-redux'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import ScreenContainer from '~/components/ScreenContainer'

import { getLoaderState } from '~/modules/loader/selectors'
import { Colors } from '~/utils/colors'
import { SuccessTick, ErrorIcon } from '~/assets/svg'
import { LoaderTypes } from '~/modules/loader/types'

const disableBackBtn = () => true

const colors = {
  default: Colors.white90,
  error: Colors.error,
  success: Colors.success,
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

  const modalVisible = msg !== ''

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
    <Modal
      animationType="slide"
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
          <Paragraph size={ParagraphSizes.medium} color={colors[type]}>
            {msg}
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
    top: 1,
    left: 1,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.mainBlack,
  },
})

export default Loader
