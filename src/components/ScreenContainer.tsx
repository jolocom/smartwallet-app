import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context'

import { Colors } from '~/utils/colors'
import NavigationHeader, { NavHeaderType } from './NavigationHeader'
import JoloText, {
  JoloTextKind,
  JoloTextWeight,
  IJoloTextProps,
} from './JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import BP from '~/utils/breakpoints'
import { SCREEN_HEADER_HEIGHT } from '~/utils/screenSettings'

interface ScreenContainerI {
  isTransparent?: boolean
  customStyles?: ViewStyle
  navigationStyles?: ViewStyle
  isFullscreen?: boolean
  backgroundColor?: Colors
  hasHeaderBack?: boolean
  hasHeaderClose?: boolean
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
    navigationStyles = {},
    backgroundColor = Colors.mainBlack,
    hasHeaderBack = false,
    hasHeaderClose = false,
    onClose,
    testID,
  }) => {
    const { top, bottom } = useSafeArea()

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
          {!isFullscreen && (
            <View
              style={{
                height: top,
                width: '100%',
                backgroundColor,
              }}
            />
          )}
          {(hasHeaderClose || hasHeaderBack) && (
            <NavigationHeader
              customStyles={navigationStyles}
              onPress={onClose}
              type={hasHeaderBack ? NavHeaderType.Back : NavHeaderType.Close}
            />
          )}
          <View
            style={[
              styles.container,
              {
                backgroundColor,
                ...((hasHeaderClose || hasHeaderBack) &&
                  navigationStyles.position === 'absolute' && {
                    marginTop: SCREEN_HEADER_HEIGHT,
                  }),
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
