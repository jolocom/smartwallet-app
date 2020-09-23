import React, { Fragment } from 'react'
import {
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context'

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
  const { bottom } = useSafeArea()
  return (
    <TouchableOpacity
      onPress={redirectToScanner}
      style={[styles.scannerBtn, styles.scannerFrame, { bottom: 28 + bottom }]}
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
  const { bottom } = useSafeArea()
  const Container = Platform.OS === 'ios' ? SafeAreaView : Fragment

  return (
    <Container style={{ backgroundColor: Colors.mainBlack }}>
      <ScannerButton />
      <ImageBackground
        style={[styles.tabsContainer, { bottom: bottom }]}
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
    </Container>
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
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 105,
    width: SCREEN_WIDTH,
    paddingVertical: 10,
    marginLeft: -0.5,
    zIndex: 10,
    marginBottom: -30,
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
