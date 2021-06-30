import React, { useRef } from 'react'
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

const ScreenContainer: React.FC<ScreenContainerI> & IScreenContainerCompound =
  ({
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
    const statusHeight = useRef(top)

    return (
      <SafeAreaView
        testID={testID}
        style={{
          flex: 1,
          paddingTop: 0,
        }}
      >
        <View
          style={[styles.navContainer, isTransparent && styles.transparent]}
        >
          {!isFullscreen && !hideStatusBar && (
            <View
              style={{
                height: statusHeight.current,
                width: '100%',
                backgroundColor,
              }}
            />
          )}
          {(hasHeaderClose || hasHeaderBack) && (
            <NavigationHeader
              onPress={onClose}
              type={hasHeaderBack ? NavHeaderType.Back : NavHeaderType.Close}
            />
          )}
          <View
            style={[
              styles.container,
              {
                backgroundColor,
                paddingBottom: isFullscreen ? 0 : bottom,
              },
              {
                ...(isFullscreen && {
                  marginBottom: -bottom,
                  ...styles.fullscreen,
                }),
              },
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
