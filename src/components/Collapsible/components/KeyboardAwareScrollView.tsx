import React, { useEffect, ComponentType } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useCollapsible } from '../context'
import { ICollapsibleComposite } from '../types'
import { COLLAPSIBLE_HEADER_HEIGHT } from './CollapsibleHeader'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import { withClassComponent } from '~/utils/withClassComponent'

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  withClassComponent(JoloKeyboardAwareScroll),
)

export const CollapsibleKeyboardAwareScrollView: ICollapsibleComposite['KeyboardAwareScrollView'] = ({
  children,
  customStyles,
  animatedHeader = false,
  ...scrollProps
}) => {
  const { handleScroll, checkListHidingTextContainer } = useCollapsible()

  useEffect(() => checkListHidingTextContainer(children), [])

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
    >
      {children}
    </AnimatedKeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: '30%',
  },
})
