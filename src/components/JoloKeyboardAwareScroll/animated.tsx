import { Animated } from 'react-native'
import { withClassComponent } from '~/hocs/withClassComponent'
import JoloKeyboardAwareScroll from '.'

export const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  withClassComponent(JoloKeyboardAwareScroll),
) as typeof JoloKeyboardAwareScroll
