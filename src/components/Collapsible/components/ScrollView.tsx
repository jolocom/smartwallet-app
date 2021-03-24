import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useCollapsible } from '../context'
import { ICollapsibleComposite } from '../types'

export const CollapsibleScrollView: ICollapsibleComposite['ScrollView'] = ({
  children,
  customStyles,
  withoutHeaderPadding = false,
  ...scrollProps
}) => {
  const { handleScroll, headerHeight } = useCollapsible()

  return (
    // @ts-ignore
    <Animated.ScrollView
      {...scrollProps}
      overScrollMode="never"
      style={{ width: '100%' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { paddingTop: withoutHeaderPadding ? 0 : headerHeight },
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
