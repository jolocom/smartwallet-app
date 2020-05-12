import React from 'react'
import {
  View,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
  Platform,
} from 'react-native'
import { Colors } from '~/utils/colors'

interface ScreenContainerI {
  isTransparent?: boolean
  customStyles?: ViewStyle
  isFullscreen?: boolean
}

const ScreenContainer: React.FC<ScreenContainerI> = ({
  children,
  customStyles,
  isTransparent = false,
  isFullscreen = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        { ...customStyles },
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
    ...Platform.select({
      android: {
        paddingTop: 20,
      },
      ios: {
        paddingTop: 50,
      },
    }),
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
