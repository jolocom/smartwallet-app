import React from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types'

import {
  DocumentsTabIcon,
  HistoryTabIcon,
  IdentityTabIcon,
  ScannerIcon,
  SettingsTabIcon,
} from '~/assets/svg'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind } from './JoloText'
import { ScreenNames } from '~/types/screens'
import useRedirectTo from '~/hooks/useRedirectTo'

interface IconPropsI {
  label: string
  key: number
  isActive: boolean
}

const SCREEN_WIDTH = Dimensions.get('window').width
const TAB_IMAGE_WIDTH = SCREEN_WIDTH
const TAB_IMAGE_HEIGHT = 0.28 * TAB_IMAGE_WIDTH
const SCANNER_BUTTON_BOTTOM = 0.545 * TAB_IMAGE_HEIGHT
const SCANNER_BTN_MARGIN = 16
const SCANNER_BUTTON_DIMENSIONS = 0.22 * SCREEN_WIDTH - SCANNER_BTN_MARGIN
const SCANNER_BUTTON_RADIUS = SCANNER_BUTTON_DIMENSIONS / 2

const Tab: React.FC<IconPropsI> = ({ label, isActive }) => {
  const redirectToTab = useRedirectTo(label as ScreenNames)
  const renderIcon = () => {
    const color = isActive ? Colors.white : Colors.white40
    switch (label) {
      case ScreenNames.Claims:
        return <IdentityTabIcon color={color} />
      case ScreenNames.Documents:
        return <DocumentsTabIcon color={color} />
      case ScreenNames.History:
        return <HistoryTabIcon color={color} />
      case ScreenNames.Settings:
        return <SettingsTabIcon color={color} />
      default:
        return null
    }
  }
  return (
    <TouchableOpacity onPress={redirectToTab}>
      <View style={styles.iconContainer}>
        {renderIcon()}
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.tiniest}
          color={isActive ? Colors.white : Colors.white40}
          customStyles={{ fontSize: 11, letterSpacing: 0.07 }}
        >
          {label}
        </JoloText>
      </View>
    </TouchableOpacity>
  )
}

const ScannerButton = () => {
  const redirectToScanner = useRedirectTo(ScreenNames.Interactions)
  return (
    <TouchableOpacity
      onPress={redirectToScanner}
      style={[
        styles.scannerBtn,
        styles.scannerFrame,
        {
          bottom: SCANNER_BUTTON_BOTTOM,
        },
      ]}
    >
      <LinearGradient
        style={[styles.scannerBtn, styles.scannerBody]}
        colors={[Colors.ceriseRed, Colors.disco]}
      >
        <ScannerIcon />
      </LinearGradient>
    </TouchableOpacity>
  )
}

const BottomBar = (props: BottomTabBarProps) => {
  const { history, routeNames, routes } = props.state
  const getSelectedRoute = (label: string) =>
    routes.find((el) => el.name === label) || { key: '' }

  return (
    <>
      <ScannerButton />
      <Image
        style={styles.tabsImage}
        source={require('~/assets/images/bottomBarBG.png')}
        resizeMode="contain"
      />
      <View style={styles.tabsContainer}>
        <View style={styles.iconGroup}>
          {routeNames.slice(0, 2).map((routeName: string, idx: number) => (
            <Tab
              key={idx}
              label={routeName}
              isActive={
                history[history.length - 1].key ===
                getSelectedRoute(routeName).key
              }
            />
          ))}
        </View>
        <View style={styles.iconGroup}>
          {props.state.routeNames
            .slice(2)
            .map((routeName: string, idx: number) => (
              <Tab
                key={idx}
                label={routeName}
                isActive={
                  history[history.length - 1].key ===
                  getSelectedRoute(routeName).key
                }
              />
            ))}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  scannerFrame: {
    position: 'absolute',
    zIndex: 100,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerBtn: {
    width: SCANNER_BUTTON_DIMENSIONS,
    height: SCANNER_BUTTON_DIMENSIONS,
    borderRadius: SCANNER_BUTTON_RADIUS,
    backgroundColor: 'transparent',
  },
  scannerBody: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SCANNER_BUTTON_DIMENSIONS,
    height: SCANNER_BUTTON_DIMENSIONS,
    borderRadius: SCANNER_BUTTON_RADIUS,
  },
  tabsImage: {
    position: 'absolute',
    bottom: 0,
    left: -0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: TAB_IMAGE_WIDTH,
    height: TAB_IMAGE_HEIGHT,
    paddingVertical: 10,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  tabsContainer: {
    position: 'absolute',
    bottom: TAB_IMAGE_HEIGHT - 65,
    flexDirection: 'row',
    width: TAB_IMAGE_WIDTH,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  iconGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 0.37,
  },
  iconContainer: {
    marginTop: 5,
    alignItems: 'center',
    flex: 1,
  },
})

export default BottomBar
