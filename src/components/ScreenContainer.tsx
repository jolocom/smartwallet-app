import React from 'react'
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native'
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
import { IWithCustomStyle } from '~/types/props'
import IconBtn from './IconBtn'

interface ScreenContainerI extends IWithCustomStyle {
  isTransparent?: boolean
  navigationStyles?: ViewStyle
  isFullscreen?: boolean
  backgroundColor?: Colors
  hasHeaderBack?: boolean
  hasHeaderClose?: boolean
  onClose?: () => void
  testID?: string
}

interface IScreenHeaderProps extends IJoloTextProps {
  rightButtonIcon?: React.ReactElement
  rightButtonAction?: () => void
}

interface IScreenContainerCompound {
  Header: React.FC<IScreenHeaderProps>
  Padding: React.FC<{ distance?: number }>
}

const ScreenContainer: React.FC<ScreenContainerI> &
  IScreenContainerCompound = ({
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
      <View style={[styles.navContainer, isTransparent && styles.transparent]}>
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
            customStyles={[{ backgroundColor }, navigationStyles]}
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
              marginBottom: -bottom,
            },
            {
              ...(isFullscreen && {
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
  rightButtonIcon,
  rightButtonAction,
  ...props
}) => {
  return (
    <View style={styles.headerContainer}>
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
      {rightButtonIcon && rightButtonAction && (
        <IconBtn
          testID="closeIcon"
          disabled={false}
          onPress={rightButtonAction}
          customStyles={styles.rightIconButton}
        >
          {rightButtonIcon}
        </IconBtn>
      )}
    </View>
  )
}

const ScreenPadding: IScreenContainerCompound['Padding'] = ({
  children,
  distance = 16,
}) => (
  <View
    style={[styles.padding, { paddingHorizontal: distance }]}
    children={children}
  />
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
    backgroundColor: Colors.transparent,
  },
  fullscreen: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  padding: {
    // TODO: double check in places that use ScreenContainer.Padding
    width: Dimensions.get('window').width,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightIconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
})

export default ScreenContainer
