import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { IWithCustomStyle } from '~/types/props'

const AbsoluteBottom: React.FC<IWithCustomStyle> = ({
  children,
  customStyles,
}) => {
  const { bottom } = useSafeArea()
  return (
    <View
      style={[styles.container, { paddingBottom: bottom + 16 }, customStyles]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
  },
})

export default AbsoluteBottom
