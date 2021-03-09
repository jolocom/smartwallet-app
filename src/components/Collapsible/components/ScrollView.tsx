import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useCollapsible } from '../context'
import { IWithCustomStyle } from '~/components/Card/types'

export const CollapsibleScrollView: React.FC<IWithCustomStyle> = ({
  children,
  customStyles,
}) => {
  const { handleScroll } = useCollapsible()

  return (
    <Animated.ScrollView
      overScrollMode="never"
      style={{ flex: 1 }}
      contentContainerStyle={[styles.container, customStyles]}
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
    paddingHorizontal: 20,
  },
})
