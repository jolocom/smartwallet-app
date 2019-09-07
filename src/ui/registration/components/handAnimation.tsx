import React, {useEffect, useRef} from 'react'
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

const usePulse = (pulseTiming: (val: Animated.Value) => Animated.CompositeAnimation) => {
  const pulseValue = useRef(new Animated.Value(0)).current

  const pulse = () => pulseTiming(pulseValue).start(pulse)

  useEffect(() => {
    const timeout = setTimeout(pulse, 0)
    return () => clearTimeout(timeout)
  })

  return pulseValue
}

const handTiming = (val: Animated.Value) =>
  Animated.sequence([
    Animated.timing(val, { toValue: 1 }),
    Animated.timing(val, { toValue: 0 })
  ])

const splashTiming = (val: Animated.Value) =>
  Animated.sequence([
    Animated.timing(val, {toValue: 1}),
    Animated.timing(val, {toValue: 0})
  ])

export const HandAnimationComponent: React.SFC<Props> = _ => {
  
  const handOpacity = usePulse(handTiming)
  const splashOpacity = usePulse(splashTiming)

  return (
    <View>
      <Animated.View style={{ opacity: splashOpacity, ...styles.splashPosition }}>
        <SplashIcon />
      </Animated.View>
      <Animated.View style={{ opacity: handOpacity, ...styles.handPosition }}>
        <HandIcon />
      </Animated.View>
    </View>
  )
}
