import React from 'react'
import { Animated } from 'react-native'
import { useCollapsibleClone } from './context'
import { ICollapsibleCloneComposite } from './types'

const Scroll: ICollapsibleCloneComposite['Scroll'] = ({
  children,
  ...scrollProps
}) => {
  const { headerHeight, scrollRef, onScroll, onSnap } = useCollapsibleClone()
  return (
    <Animated.ScrollView
      ref={scrollRef}
      contentContainerStyle={{
        paddingTop: headerHeight,
      }}
      style={{ width: '100%' }}
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
