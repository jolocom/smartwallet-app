import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'

interface ScreenContainerI {
  isTransparent?: boolean
  isFullscreen?: boolean
  backgroundColor: Colors
}

const ScreenContainer: React.FC<ScreenContainerI> = ({
  children,
  isTransparent = false,
  isFullscreen = false,
  backgroundColor = Colors.mainBlack,
}) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        isTransparent && styles.transparent,
        isFullscreen && styles.fullscreen,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  fullscreen: {
    paddingHorizontal: 0,
  },
})

export default ScreenContainer
