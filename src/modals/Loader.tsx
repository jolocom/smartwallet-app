import React, { useEffect, useRef, useState } from 'react'
import { View, Animated, StyleSheet, Easing } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { WaveIndicator } from 'react-native-indicators'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import ScreenContainer from '~/components/ScreenContainer'
import Circle from '~/components/Circle'
import Modal from '~/modals/Modal'

import { getLoaderState } from '~/modules/loader/selectors'
import { Colors } from '~/utils/colors'
import { SuccessTick, ErrorIcon } from '~/assets/svg'
import { LoaderTypes } from '~/modules/loader/types'
import useDelay from '~/hooks/useDelay'
import { dismissLoader } from '~/modules/loader/actions'
import { isAppLocked, isLocalAuthSet } from '~/modules/account/selectors'

const colors: { [x: string]: Colors } = {
  default: Colors.white70,
  error: Colors.error,
  success: Colors.success,
}

interface LoaderI {
  bgColor?: Colors
}

const Loader: React.FC<LoaderI> = ({ bgColor = Colors.black95 }) => {
  const { msg, type } = useSelector(getLoaderState)
  const isAnimating = useRef(true)
  const dispatch = useDispatch()

  const loaderType = useRef(type)
  const loaderMsg = useRef(msg)
  const loaderColor = useRef(colors[loaderType.current])

  const [status, setStatus] = useState(msg)

  const errorScale = useRef(new Animated.Value(0)).current
  const errorOpacity = errorScale.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const animatedOpacity = useRef(new Animated.Value(0)).current
  const animatedWidth = animatedOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  })

  const bounceError = async () => {
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(errorScale, {
        toValue: 0.8,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start()
    await useDelay(() => dispatch(dismissLoader()), 3000)
  }

  const showTick = async () => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start()
    await useDelay(() => dispatch(dismissLoader()), 3000)
  }

  const modalVisible = msg !== ''

  const looping = () => {
    if (loaderType.current === LoaderTypes.default) {
      setTimeout(() => {
        if (loaderType.current === LoaderTypes.default) {
          looping()
        } else if (loaderType.current === LoaderTypes.error) {
          setStatus(loaderMsg.current)
          bounceError()
        } else if (loaderType.current === LoaderTypes.success) {
          setStatus(loaderMsg.current)
          showTick()
        }
      }, 2000)
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

  const renderLoaderType = () => {
    if (loaderType.current === LoaderTypes.default) {
      return (
        <View style={{ width: CIRCLE_DIAMETER, height: CIRCLE_DIAMETER }}>
          <WaveIndicator
            color={loaderColor.current}
            count={2}
            size={CIRCLE_DIAMETER}
            waveMode={'outline'}
            //waveFactor={0.4}
          />
        </View>
      )
    } else {
      return (
        <Circle
          diameter={60}
          bgColor={loaderColor.current}
          animatedStyles={{
            opacity: animatedOpacity,
            transform: [{ scale: animatedWidth }],
            borderWidth: 1,
          }}
        >
          {loaderType.current === LoaderTypes.success ? (
            <View style={styles.tickContainer}>
              <View
                style={{
                  position: 'absolute',
                  transform: [{ scale: 0.8 }],
                }}
              >
                <SuccessTick />
              </View>
            </View>
          ) : (
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
        </Circle>
      )
    }
  }

  const CIRCLE_DIAMETER = 70
  return (
    <Modal isVisible={modalVisible}>
      <View style={[styles.modalBodyContainer, { backgroundColor: bgColor }]}>
        {renderLoaderType()}
        <Paragraph
          customStyles={{ marginTop: 20, opacity: 0.9 }}
          size={ParagraphSizes.medium}
          color={loaderColor.current}
        >
          {status}
        </Paragraph>
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
    width: 10,
  },
})

export default function () {
  const { isVisible } = useSelector(getLoaderState)
  const isLocked = useSelector(isAppLocked)
  const isAuthSet = useSelector(isLocalAuthSet)

  // isVisible && isLocked && !isAuthSet => Logged out section
  if ((isVisible && !isLocked) || (isVisible && isLocked && !isAuthSet)) {
    return <Loader />
  }
  return null
}
