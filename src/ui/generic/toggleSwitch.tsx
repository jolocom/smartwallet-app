import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, Animated } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    width: 45,
    height: 30,
    borderRadius: 45,
    backgroundColor: 'rgb(55, 53, 55)',
  },
  toggle: {
    alignItems: 'center',
    justifyContent: 'center',
    //margin: 4,
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 3,
  },
})

interface Props {
  value: boolean
  defaultState: boolean
  onToggle: () => void
}

export const ToggleSwitch = (props: Props) => {
  const { defaultState, onToggle, value } = props

  const onGradient = ['rgb(145, 25, 66)', 'rgb(210, 45, 105)']
  const offGradient = ['rgb(12, 12, 12)', 'rgb(12, 12, 12)']

  const offPosition = 2
  const onPosition = 17
  const initialPosition = defaultState ? onPosition : offPosition

  const [propValue, setValue] = useState<boolean>(defaultState)
  const [positionValue] = useState<Animated.Value>(
    new Animated.Value(initialPosition),
  )

  useEffect(() => setValue(value), [value])

  const onPress = () => {
    Animated.sequence([
      Animated.timing(positionValue, {
        toValue: !propValue ? onPosition : offPosition,
        duration: 300,
      }),
    ]).start()
    onToggle()
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
          style={{ width: '100%', height: '100%', borderRadius: 13 }}
          locations={[0, 6]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={propValue ? onGradient : offGradient}
        />
      </Animated.View>
    </TouchableOpacity>
  )
}
