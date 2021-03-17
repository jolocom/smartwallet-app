import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useCollapsible } from '../context'
import { ICollapsibleComposite } from '../types'
import { COLLAPSIBLE_HEADER_HEIGHT } from './CollapsibleHeader'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import { withClassComponent } from '~/hocs/withClassComponent'

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  withClassComponent(JoloKeyboardAwareScroll),
) as typeof JoloKeyboardAwareScroll

export const CollapsibleKeyboardAwareScrollView: ICollapsibleComposite['KeyboardAwareScrollView'] = ({
  children,
  customStyles,
  animatedHeader = false,
  ...scrollProps
}) => {
  const { handleScroll } = useCollapsible()

  return (
    <AnimatedKeyboardAwareScrollView
      {...scrollProps}
      overScrollMode="never"
      style={{ width: '100%' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { paddingTop: animatedHeader ? 0 : COLLAPSIBLE_HEADER_HEIGHT },
        customStyles,
      ]}
      scrollEventThrottle={1}
      onScroll={handleScroll}
      // FIXME: Currently android uses the `adjustPan` setting for adjusting the views
      // around the keyboard, which moves the header outside the screeen. Can be
      // changed to the default behavior as soon as the
      // usage of the keyboard on the Passcode screen is removed, allowing to control
      // the keyboard using the KeyboardAwareScrollView
      // enableOnAndroid={true}
    >
      {children}
    </AnimatedKeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: '30%',
  },
})
