import React, { useRef, useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, Animated } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { Colors } from '~/utils/colors'

interface Props {
  initialState: boolean
  onToggle: (state: boolean) => void
}

const ON_POSITION = 17
const OFF_POSITION = 2

const ToggleSwitch = (props: Props) => {
  const { onToggle, initialState } = props

  const [toggled, setToggled] = useState(initialState)

  const onGradientColors = [Colors.carnationPink, Colors.hyacinthPink]
  const offGradientColors = [Colors.haiti, Colors.haiti]

  const positionValue = useRef(
    new Animated.Value(toggled ? ON_POSITION : OFF_POSITION),
  ).current

  const onPress = () => {
    Animated.timing(positionValue, {
      toValue: toggled ? OFF_POSITION : ON_POSITION,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setToggled(!toggled))
    onToggle(!toggled)
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.track}
    >
      <Animated.View
        style={{
          ...styles.toggle,
          transform: [{ translateX: positionValue }],
        }}
      >
        <LinearGradient
          style={styles.gradientWrapper}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={toggled ? onGradientColors : offGradientColors}
        />
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    width: 45,
    height: 30,
    borderRadius: 45,
    backgroundColor: Colors.blackRussian,
  },
  toggle: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  gradientWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
})

export default ToggleSwitch
