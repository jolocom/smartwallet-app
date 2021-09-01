import React from 'react'
import { Animated } from 'react-native'
import { withClassComponent } from '~/hocs/withClassComponent'
import JoloKeyboardAwareScroll from '../JoloKeyboardAwareScroll'
import { useCollapsibleClone } from './context'
import { ICollapsibleCloneComposite } from './types'

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  withClassComponent(JoloKeyboardAwareScroll),
) as typeof JoloKeyboardAwareScroll

/**
 * NOTE: the challenge here is to pass ref of JoloKeyboardAwareScroll to
 * snap function to control scrolling from outside of JoloKeyboardAwareScroll
 */
const KeyboardAwareScrollView: ICollapsibleCloneComposite['KeyboardAwareScroll'] =
  ({ children, ...scrollProps }) => {
    const { headerHeight, onScroll, onSnap } = useCollapsibleClone()
    return (
      <AnimatedKeyboardAwareScrollView
        contentContainerStyle={{
          paddingTop: headerHeight,
        }}
        style={{ width: '100%' }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
        onScrollEndDrag={onSnap}
      >
        {children}
      </AnimatedKeyboardAwareScrollView>
    )
  }

export default KeyboardAwareScrollView
