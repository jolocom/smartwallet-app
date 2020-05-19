import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors } from '~/utils/colors'

interface ScreenContainerI {
  isTransparent?: boolean
  isFullscreen?: boolean
  customStyles?: ViewStyle | ViewStyle[]
}

const ScreenContainer: React.FC<ScreenContainerI> = ({
  children,
  isTransparent = false,
  isFullscreen = false,
  customStyles = {},
}) => {
  return (
    <View
      style={[
        styles.container,
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
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  fullscreen: {
    paddingHorizontal: 0,
  },
})

export default ScreenContainer
