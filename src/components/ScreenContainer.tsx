import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors } from '~/utils/colors'

interface ScreenContainerI {
  isTransparent?: boolean
  customStyles?: ViewStyle
  isFullscreen?: boolean
  backgroundColor?: Colors
}

const ScreenContainer: React.FC<ScreenContainerI> = ({
  children,
  isTransparent = false,
  isFullscreen = false,
  customStyles = {},
  backgroundColor = Colors.mainBlack,
}) => {
  return (
    <View
      style={[
        styles.container,
        { ...customStyles },
        { backgroundColor },
        isTransparent && styles.transparent,
        isFullscreen && styles.fullscreen,
        customStyles,
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
    backgroundColor: Colors.mainBlack,
    position: 'relative',
    paddingTop: 40,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  fullscreen: {
    paddingHorizontal: 0,
  },
})

export default ScreenContainer
