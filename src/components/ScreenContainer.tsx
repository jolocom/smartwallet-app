import React from 'react'
import { View, StyleSheet, ViewStyle, Platform } from 'react-native'
import { Colors } from '~/utils/colors'
import NavigationHeader, { NavHeaderType } from './NavigationHeader'

interface ScreenContainerI {
  isTransparent?: boolean
  customStyles?: ViewStyle
  isFullscreen?: boolean
  backgroundColor?: Colors
  hasHeaderBack?: boolean
  hasHeaderClose?: boolean
}

const ScreenContainer: React.FC<ScreenContainerI> = ({
  children,
  isTransparent = false,
  isFullscreen = false,
  customStyles = {},
  backgroundColor = Colors.mainBlack,
  hasHeaderBack = false,
  hasHeaderClose = false,
}) => {
  return (
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
  )
}

const styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: Colors.mainBlack,
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
    paddingTop: 40,
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
