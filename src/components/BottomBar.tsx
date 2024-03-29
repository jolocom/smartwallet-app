import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { useSafeArea } from 'react-native-safe-area-context'
import Hide from 'react-native-hide-with-keyboard'

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
import { useRedirect } from '~/hooks/navigation'
import BP from '~/utils/breakpoints'
import { SCREEN_WIDTH } from '~/utils/dimensions'

interface IconPropsI {
  label: string
  key: number
  route: string
  isActive: boolean
}

const SCALE_BY = SCREEN_WIDTH / 414

/* picture has invisble horizontal margins, therefore adding 4 point to hide it */
const SCREEN_WIDTH_ADJUSTED = SCREEN_WIDTH + 12
const TAB_IMAGE_WIDTH = SCREEN_WIDTH_ADJUSTED
const TAB_IMAGE_HEIGHT = 0.192 * TAB_IMAGE_WIDTH
const SCANNER_BUTTON_BOTTOM = 0.345 * TAB_IMAGE_HEIGHT
const SCANNER_BTN_MARGIN = 16
const SCANNER_BUTTON_DIMENSIONS =
  0.22 * SCREEN_WIDTH_ADJUSTED - SCANNER_BTN_MARGIN
const SCANNER_BUTTON_RADIUS = SCANNER_BUTTON_DIMENSIONS / 2
const TABS_POSITION_BOTTOM = BP({
  default: 0.2 * TAB_IMAGE_HEIGHT,
  xsmall: 0.1 * TAB_IMAGE_HEIGHT,
})
/* picture has invisble bottom margins, therefore adding 1 point to hide it */
const INVISIBLE_BOTTOM_MARGIN = 1

const Tab: React.FC<IconPropsI> = ({ label, isActive, route }) => {
  const redirect = useRedirect()
  const renderIcon = () => {
    const color = isActive ? Colors.white : Colors.white40

    switch (route) {
      case ScreenNames.Identity: {
        return <IdentityTabIcon color={color} />
      }
      case ScreenNames.Documents: {
        return <DocumentsTabIcon color={color} />
      }
      case ScreenNames.History: {
        return <HistoryTabIcon color={color} />
      }
      case ScreenNames.Settings: {
        return <SettingsTabIcon color={color} />
      }
      default: {
        return null
      }
    }
  }

  return (
    <TouchableOpacity onPress={() => redirect(route as ScreenNames)}>
      <View style={styles.iconContainer}>
        <View style={{ transform: [{ scale: SCALE_BY }] }}>{renderIcon()}</View>
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.tiniest}
          color={isActive ? Colors.white : Colors.white40}
          customStyles={{
            fontSize: 11,
            letterSpacing: 0.07,
            marginTop: 4,
          }}
        >
          {label}
        </JoloText>
      </View>
    </TouchableOpacity>
  )
}

const ScannerButton = () => {
  const redirect = useRedirect()
  const insets = useSafeArea()
  return (
    <TouchableOpacity
      onPress={() =>
        redirect(ScreenNames.Interaction, {
          screen: ScreenNames.Scanner,
        })
      }
      style={[
        styles.scannerBtn,
        styles.scannerFrame,
        {
          bottom:
            SCANNER_BUTTON_BOTTOM + insets.bottom - INVISIBLE_BOTTOM_MARGIN,
        },
      ]}
    >
      <LinearGradient
        style={[styles.scannerBtn, styles.scannerBody]}
        colors={[Colors.ceriseRed, Colors.disco]}
      >
        <View
          style={{
            transform: [{ scale: BP({ default: 1, xsmall: 0.9 }) }],
          }}
        >
          <ScannerIcon />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const BottomBar = (props: BottomTabBarProps) => {
  const { descriptors } = props
  const { history, routes } = props.state
  const getSelectedRoute = (label: string) =>
    routes.find((el) => el.name === label) || { key: '' }

  const insets = useSafeArea()

  return (
    <Hide>
      <View
        style={{
          paddingBottom: insets.bottom,
          backgroundColor: Colors.haiti,
        }}
      />
      <ScannerButton />

      <Image
        style={[
          styles.tabsImage,
          { bottom: insets.bottom - INVISIBLE_BOTTOM_MARGIN },
        ]}
        source={require('~/assets/images/blackBckgr.png')}
        resizeMode="contain"
      />
      <View
        style={[
          styles.tabsContainer,
          {
            bottom: TABS_POSITION_BOTTOM + insets.bottom,
          },
        ]}
      >
        <View style={styles.iconGroup}>
          {routes.slice(0, 2).map(({ name: routeName, key }, idx: number) => (
            <Tab
              key={idx}
              route={routeName}
              label={
                (descriptors[key].options.tabBarLabel as string) ?? routeName
              }
              isActive={
                history[history.length - 1].key ===
                getSelectedRoute(routeName).key
              }
            />
          ))}
        </View>
        <View style={styles.iconGroup}>
          {routes.slice(2).map(({ name: routeName, key }, idx: number) => (
            <Tab
              key={idx}
              route={routeName}
              label={
                (descriptors[key].options.tabBarLabel as string) ?? routeName
              }
              isActive={
                history[history.length - 1].key ===
                getSelectedRoute(routeName).key
              }
            />
          ))}
        </View>
      </View>
    </Hide>
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
