import React from 'react'
import { Animated } from 'react-native'
import { useCollapsible } from './context'
import { ICollapsibleComposite } from './types'

const Scroll: ICollapsibleComposite['Scroll'] = ({
  children,
  containerStyles,
  ...scrollProps
}) => {
  const { headerHeight, scrollRef, onScroll, onSnap } = useCollapsible()
  return (
    <Animated.ScrollView
      ref={scrollRef}
      contentContainerStyle={[{ paddingTop: headerHeight }, containerStyles]}
      onScroll={onScroll}
      scrollEventThrottle={16}
      onScrollEndDrag={onSnap}
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      {children}
    </Animated.ScrollView>
  )
}

export default Scroll
