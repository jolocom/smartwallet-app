import React from 'react'
import { View, StyleSheet, ViewStyle, Platform, StatusBar } from 'react-native'
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context'

import { Colors } from '~/utils/colors'
import NavigationHeader, { NavHeaderType } from './NavigationHeader'
import BP from '~/utils/breakpoints'
import { useHideStatusBar } from '~/hooks/generic'

interface ScreenContainerI {
  isTransparent?: boolean
  customStyles?: ViewStyle
  isFullscreen?: boolean
  backgroundColor?: Colors
  hasHeaderBack?: boolean
  hasHeaderClose?: boolean
  hideStatusBar?: boolean
  onClose?: () => void
  testID?: string
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
  onClose,
  testID,
}) => {
  hideStatusBar && useHideStatusBar()

  const { top } = useSafeArea()

  return (
    <SafeAreaView
      testID={testID}
      style={{
        flex: 1,
        backgroundColor,
        paddingTop: hideStatusBar
          ? 0
          : Platform.select({
              android: StatusBar.currentHeight,
              ios: top,
            }),
      }}
      mode="padding"
    >
      <View style={[styles.navContainer, isTransparent && styles.transparent]}>
        {(hasHeaderClose || hasHeaderBack) && (
          <NavigationHeader
            onPress={onClose}
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
      default: 40,
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
