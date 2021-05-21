import React from 'react'
import { View, StyleSheet, ViewStyle, Platform, StatusBar } from 'react-native'
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context'

import { Colors } from '~/utils/colors'
import NavigationHeader, { NavHeaderType } from './NavigationHeader'
import { useHideStatusBar } from '~/hooks/generic'
import JoloText, {
  JoloTextKind,
  JoloTextWeight,
  IJoloTextProps,
} from './JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import BP from '~/utils/breakpoints'

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

interface IScreenContainerCompound {
  Header: React.FC<IJoloTextProps>
  Padding: React.FC
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
  testID,
}) => {
  hideStatusBar && useHideStatusBar()

  const { top, bottom } = useSafeArea()

  return (
    <SafeAreaView
      testID={testID}
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

const ScreenContainerHeader: IScreenContainerCompound['Header'] = ({
  children,
  customStyles,
  ...props
}) => {
  return (
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.middle}
      weight={JoloTextWeight.regular}
      color={Colors.white85}
      {...props}
      customStyles={[
        {
          alignSelf: 'flex-start',
          textAlign: 'left',
          marginTop: 16,
          marginBottom: BP({ default: 8, small: 4, xsmall: 4 }),
        },
        customStyles,
      ]}
    >
      {children}
    </JoloText>
  )
}

const ScreenPadding: IScreenContainerCompound['Padding'] = ({ children }) => (
  <View style={styles.padding} children={children} />
)

ScreenContainer.Header = ScreenContainerHeader
ScreenContainer.Padding = ScreenPadding

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
    paddingHorizontal: 16,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  fullscreen: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  padding: {
    width: '100%',
    paddingHorizontal: 16,
  },
})

export default ScreenContainer
