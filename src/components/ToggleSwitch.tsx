import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Animated } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import { Colors } from '~/utils/colors'

interface Props {
  onToggle?: () => void
  on?: boolean
}

const ON_POSITION = 17
const OFF_POSITION = 2

const ToggleSwitch: React.FC<Props & Record<string, any>> = (props) => {
  const [isOn, setIsOn] = useState(false)

  const isPropControlled = (prop: string) => {
    return props[prop] !== undefined
  }

  const getOnState = () => {
    return isPropControlled('on') ? props.on : isOn
  }
  const onState = getOnState()

  const onGradientColors = [Colors.carnationPink, Colors.hyacinthPink]
  const offGradientColors = [Colors.haiti, Colors.haiti]

  const positionValue = useRef(
    new Animated.Value(onState ? ON_POSITION : OFF_POSITION),
  ).current

  const toggle = () => {
    if (isPropControlled('on')) {
      props.onToggle && props.onToggle()
    } else {
      setIsOn((prevState) => !prevState)
    }
  }

  useEffect(() => {
    Animated.timing(positionValue, {
      toValue: onState ? ON_POSITION : OFF_POSITION,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [onState])

  return (
    <TouchableWithoutFeedback
      testID="toggleSwitch"
      style={styles.track}
      onPressIn={toggle}
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
          colors={onState ? onGradientColors : offGradientColors}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
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
    elevation: 10,
    shadowColor: Colors.black06,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 1,
    shadowOpacity: 1,
  },
  gradientWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
})

export default ToggleSwitch
