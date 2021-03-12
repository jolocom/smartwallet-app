import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useCollapsible } from '../context'
import { ICollapsibleComposite } from '../types'
import { COLLAPSIBLE_HEADER_HEIGHT } from './CollapsibleHeader'

export const CollapsibleScrollView: ICollapsibleComposite['ScrollView'] = ({
  children,
  customStyles,
  animatedHeader = false,
  ...scrollProps
}) => {
  const { handleScroll } = useCollapsible()

  return (
    <Animated.ScrollView
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
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: '30%',
  },
})
