import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useKeyboardHeight } from '~/hooks/useKeyboardHeight'
import { reusedStyles } from './BasWrapper'

interface PropsI {
  showIcon: boolean
}

const BasWrapperContainer: React.FC<PropsI> = ({ children, showIcon }) => {
  const { bottom } = useSafeArea()
  const { keyboardHeight } = useKeyboardHeight(0)
  const bottomPosition = keyboardHeight ? keyboardHeight + 5 : bottom + 5
  const animatedOpacity = useRef(new Animated.Value(showIcon ? 1 : 0)).current

  useEffect(() => {
    if (keyboardHeight) {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start()
    }
  }, [keyboardHeight])

  return (
    <Animated.View
      style={[
        reusedStyles.wrapper,
        { bottom: bottomPosition },
        { opacity: animatedOpacity },
      ]}
    >
      {children}
    </Animated.View>
  )
}

export default BasWrapperContainer
