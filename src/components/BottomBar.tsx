import React from 'react'
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { SafeAreaView } from 'react-native-safe-area-context'

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
    <TouchableWithoutFeedback onPress={redirectToTab}>
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
    </TouchableWithoutFeedback>
  )
}

const ScannerButton = () => {
  const redirectToScanner = useRedirectTo(ScreenNames.Interactions)
  return (
    <TouchableOpacity
      onPress={redirectToScanner}
      style={[styles.scannerBtn, styles.scannerFrame]}
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
    <SafeAreaView style={{ backgroundColor: Colors.mainBlack, height: 1 }}>
      <View style={styles.container}>
        <ScannerButton />
        <ImageBackground
          style={styles.tabsContainer}
          source={require('~/assets/images/bottomBarBG.png')}
        >
          <View style={[styles.iconGroup, { justifyContent: 'flex-start' }]}>
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
          <View style={[styles.iconGroup, { justifyContent: 'flex-end' }]}>
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
        </ImageBackground>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scannerFrame: {
    position: 'absolute',
    bottom: 58,
    zIndex: 100,
  },
  scannerBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  scannerBody: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 105,
    width: SCREEN_WIDTH,
    paddingVertical: 10,
    // marginLeft: -1,
    zIndex: 10,
  },
  iconContainer: {
    paddingHorizontal: 13,
    marginTop: 5,
    alignItems: 'center',
  },
  iconGroup: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    flex: 0.5,
  },
})

export default BottomBar
