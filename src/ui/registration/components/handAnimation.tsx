import React, { useRef, useEffect } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { HandIcon, SplashIcon } from 'src/resources/index'

interface Props {
}

const styles = StyleSheet.create({
  handPosition: {
    position: 'absolute',
    // TODO change to be % based
    top: 11,
    left: 8
  },
  splashPosition: {
    position: 'absolute',
    top: 0,
    left: 0
  },
})

export const usePulseForBoth = () => {
  const handPV = useRef(new Animated.Value(0)).current
  const splashPV = useRef(new Animated.Value(0)).current

  const pulse = () => Animated.parallel([
    Animated.sequence(
      [1, 0, 1, 0, 0, 1, 0].map(n => Animated.timing(splashPV, {toValue: n}))
    ),
    Animated.sequence(
      [1, 1, 1, 0, 0, 1, 1].map(n => Animated.timing(handPV, {toValue: n}))
    )
  ]).start(pulse)

  useEffect(() => {
    const timeout = setTimeout(pulse, 0)
    return () => clearTimeout(timeout)
  })

  return {handPV, splashPV}
}

export const HandAnimationComponent: React.SFC<Props> = _ => {

  const { handPV, splashPV } = usePulseForBoth()

  return (
    <View>
      <Animated.View style={{ opacity: splashPV, ...styles.splashPosition }}>
        <SplashIcon />
      </Animated.View>
      <Animated.View style={{ opacity: handPV, ...styles.handPosition }}>
        <HandIcon />
      </Animated.View>
    </View>
  )
}
