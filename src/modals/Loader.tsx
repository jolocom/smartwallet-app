import React, { useEffect, useRef, useState } from 'react'
import { View, Animated, StyleSheet, Easing } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { WaveIndicator } from 'react-native-indicators'

import Circle from '~/components/Circle'
import Modal from '~/modals/Modal'

import { getLoaderState } from '~/modules/loader/selectors'
import { Colors } from '~/utils/colors'
import { SuccessTick, ErrorIcon } from '~/assets/svg'
import { LoaderTypes } from '~/modules/loader/types'
import useDelay from '~/hooks/useDelay'
import { dismissLoader } from '~/modules/loader/actions'
import { isLocalAuthSet } from '~/modules/account/selectors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

const colors: Record<string, Colors> = {
  default: Colors.white70,
  error: Colors.white70,
  success: Colors.white70,
}

interface LoaderI {
  bgColor?: Colors
}

const CIRCLE_DIAMETER = 70

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
        toValue: 1,
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

  const looping = async () => {
    if (loaderType.current === LoaderTypes.default) {
      setTimeout(async () => {
        if (loaderType.current === LoaderTypes.default) {
          await looping()
        } else if (loaderType.current === LoaderTypes.error) {
          setStatus(loaderMsg.current)
          await bounceError()
        } else if (loaderType.current === LoaderTypes.success) {
          setStatus(loaderMsg.current)
          await showTick()
        }
      }, 2000)
    } else if (loaderType.current === LoaderTypes.error) {
      await bounceError()
    } else if (loaderType.current === LoaderTypes.success) {
      await showTick()
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
        <View
          style={{
            width: CIRCLE_DIAMETER,
            height: CIRCLE_DIAMETER,
          }}
        >
          <WaveIndicator
            color={loaderColor.current}
            count={2}
            size={CIRCLE_DIAMETER}
            waveMode={'outline'}
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
            marginBottom: 10,
          }}
        >
          {loaderType.current === LoaderTypes.success ? (
            <View style={styles.tickContainer}>
              <View>
                <SuccessTick color={loaderColor.current} />
              </View>
            </View>
          ) : (
            <Animated.View
              style={{
                transform: [{ scale: errorScale }],
                opacity: errorOpacity,
              }}
            >
              <ErrorIcon color={loaderColor.current} />
            </Animated.View>
          )}
        </Circle>
      )
    }
  }

  return (
    <Modal isVisible={modalVisible}>
      <View style={[styles.modalBodyContainer, { backgroundColor: bgColor }]}>
        <View
          style={{
            height: 200,
            width: 230,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {renderLoaderType()}

          <JoloText
            kind={JoloTextKind.subtitle}
            size={JoloTextSizes.big}
            color={Colors.white80}
            customStyles={{ marginTop: 5 }}
          >
            {status}
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
    justifyContent: 'center',
    zIndex: 10,
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
  description: {
    marginTop: 20,
    opacity: 0.9,
  },
})

export default function () {
  const { isVisible: isLoaderVisible } = useSelector(getLoaderState)
  const isAuthSet = useSelector(isLocalAuthSet)

  // isVisible && isLocked && !isAuthSet => Logged out section
  if (isLoaderVisible || (isLoaderVisible && !isAuthSet)) {
    return <Loader />
  }
  return null
}
