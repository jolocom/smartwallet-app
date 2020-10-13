import React from 'react'
import { View, StyleSheet, ViewStyle, Platform, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors } from '~/utils/colors'
import NavigationHeader, { NavHeaderType } from './NavigationHeader'
import BP from '~/utils/breakpoints'
import useHideStatusBar from '~/hooks/useHideStatusBar'

interface ScreenContainerI {
  isTransparent?: boolean
  customStyles?: ViewStyle
  isFullscreen?: boolean
  backgroundColor?: Colors
  hasHeaderBack?: boolean
  hasHeaderClose?: boolean
  hideStatusBar?: boolean
}

const ScreenContainer: React.FC<ScreenContainerI> = ({
  children,
  isTransparent = false,
  isFullscreen = false,
  customStyles = {},
  backgroundColor = Colors.mainBlack,
  hasHeaderBack = false,
  hasHeaderClose = false,
  hideStatusBar = false,
}) => {
  hideStatusBar && useHideStatusBar()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
        paddingTop: isFullscreen
          ? 0
          : Platform.select({
              android: StatusBar.currentHeight,
              ios: 20,
            }),
      }}
      mode="padding"
    >
      <View style={[styles.navContainer, isTransparent && styles.transparent]}>
        {(hasHeaderClose || hasHeaderBack) && (
          <NavigationHeader
            type={hasHeaderBack ? NavHeaderType.Back : NavHeaderType.Close}
          />
        )}
        <View
          style={[
            styles.container,
            { ...customStyles },
            { backgroundColor },
            isFullscreen && styles.fullscreen,
            customStyles,
          ]}
        >
          {children}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
    paddingTop: BP({
      large: 40,
      medium: 40,
      small: 15,
      xsmall: 15,
    }),
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  fullscreen: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
})

export default ScreenContainer