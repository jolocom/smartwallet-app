import React, { useRef, useEffect } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { HandIcon, SplashIcon } from '~/assets/svg'

const usePulseForBoth = () => {
  const handPV = useRef(new Animated.Value(0)).current
  const splashPV = useRef(new Animated.Value(0)).current
  const isPulsingRef = useRef(true)

  const pulse = () =>
    Animated.parallel([
      Animated.sequence(
        [1, 0, 1, 0, 0, 1, 0].map((n) =>
          Animated.timing(splashPV, { toValue: n, useNativeDriver: true }),
        ),
      ),
      Animated.sequence(
        [1, 1, 1, 0, 0, 1, 1].map((n) =>
          Animated.timing(handPV, { toValue: n, useNativeDriver: true }),
        ),
      ),
    ]).start(() => {
      isPulsingRef.current && pulse()
    })

  useEffect(() => {
    pulse()
    return () => {
      isPulsingRef.current = false
    }
  })

  return { handPV, splashPV }
}

export const HandAnimation: React.FC = () => {
  const { handPV, splashPV } = usePulseForBoth()

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: splashPV, ...styles.splashPosition }}>
        <SplashIcon />
      </Animated.View>
      <Animated.View style={{ opacity: handPV, ...styles.handPosition }}>
        <HandIcon />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 36,
    width: 78,
    height: 84,
  },

  handPosition: {
    top: -29,
    left: 8,
  },
  splashPosition: {
    top: -2,
    left: -8,
  },
})
