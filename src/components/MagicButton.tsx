import React from 'react'
import {
  Animated,
  GestureResponderHandlers,
  Platform,
  StyleSheet,
} from 'react-native'
import RadialGradient from 'react-native-radial-gradient'
import { Colors } from '~/utils/colors'

interface IProps {
  gestureHandlers: GestureResponderHandlers | undefined
  animatedValues: {
    shadowScale: Animated.Value | Animated.ValueXY
    magicOpacity: Animated.Value | Animated.ValueXY
    circleScale: Animated.Value | Animated.ValueXY
  }
}

const MagicButton: React.FC<IProps> = ({ gestureHandlers, animatedValues }) => {
  const { shadowScale, magicOpacity, circleScale } = animatedValues
  return (
    <Animated.View
      {...gestureHandlers}
      style={[
        {
          transform: [{ scaleX: shadowScale }, { scaleY: shadowScale }],
          opacity: magicOpacity,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: circleScale }],
          },
        ]}
      />
      <RadialGradient
        style={styles.gradient}
        colors={[Colors.success, 'transparent']}
        stops={[0.4, 1]}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.black,
    borderColor: Colors.success,
    borderWidth: Platform.select({
      ios: 1,
      android: 0.5,
    }),
    zIndex: 20,
  },
  gradient: {
    width: 160,
    height: 160,
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'center',
  },
})

export default MagicButton
