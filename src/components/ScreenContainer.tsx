import React from 'react'
import { View, StyleSheet, ViewStyle, Platform, StatusBar } from 'react-native'
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context'

import { Colors } from '~/utils/colors'
import NavigationHeader, { NavHeaderType } from './NavigationHeader'
import BP from '~/utils/breakpoints'
import { useHideStatusBar } from '~/hooks/generic'
import JoloText, {
  JoloTextKind,
  JoloTextWeight,
  IJoloTextProps,
} from './JoloText'
import { JoloTextSizes } from '~/utils/fonts'

interface ScreenContainerI {
  isTransparent?: boolean
  customStyles?: ViewStyle
  isFullscreen?: boolean
  backgroundColor?: Colors
  hasHeaderBack?: boolean
  hasHeaderClose?: boolean
  hideStatusBar?: boolean
  onClose?: () => void
}

interface IScreenContainerCompound {
  Header: React.FC<IJoloTextProps>
}

const ScreenContainer: React.FC<ScreenContainerI> &
  IScreenContainerCompound = ({
  children,
  isTransparent = false,
  isFullscreen = false,
  customStyles = {},
  backgroundColor = Colors.mainBlack,
  hasHeaderBack = false,
  hasHeaderClose = false,
  hideStatusBar = false,
  onClose,
}) => {
  hideStatusBar && useHideStatusBar()

  const { top, bottom } = useSafeArea()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
        paddingBottom: isFullscreen ? 0 : bottom,
        paddingTop:
          hideStatusBar || isFullscreen
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

const ScreenContainerHeader: React.FC<IJoloTextProps> = ({
  children,
  customStyles,
  ...props
}) => {
  return (
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.middle}
      weight={JoloTextWeight.regular}
      {...props}
      customStyles={[
        {
          alignSelf: 'flex-start',
          textAlign: 'left',
          marginTop: 16,
          marginBottom: 8,
        },
        customStyles,
      ]}
    >
      {children}
    </JoloText>
  )
}

ScreenContainer.Header = ScreenContainerHeader

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
