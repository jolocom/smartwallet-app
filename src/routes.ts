import { Platform, Image } from 'react-native'
import { createElement } from 'react'

import {
  createStackNavigator,
  createBottomTabNavigator,
  NavigationScreenOptions,
  NavigationRoute,
  NavigationScreenProp
} from 'react-navigation'
import { Claims, Interactions, Records, ClaimDetails } from 'src/ui/home/'
import { Landing } from 'src/ui/landing/'
import { PaymentConsent } from 'src/ui/payment'
import { SeedPhrase, Loading, Entropy } from 'src/ui/registration/'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Exception, /*BottomNavBar*/ } from 'src/ui/generic/'
import { Consent } from 'src/ui/sso'
import { CredentialReceive } from 'src/ui/home'
import { Settings } from 'src/ui/settings'
import I18n from 'src/locales/i18n'
import { QRScannerContainer } from 'src/ui/generic/qrcodeScanner'
import { AuthenticationConsent } from 'src/ui/authentication'
import { routeList } from './routeList'

import {
  IdentityMenuIcon,
  RecordsMenuIcon,
  DocumentsMenuIcon,
  SettingsMenuIcon,
} from 'src/resources'

const headerBackImage = createElement(
  Image,
  {
    source: Platform.OS === 'android'
      ? require('./resources/img/close.png')
      : require('./resources/img/back-26.png')
  }
)

const noHeaderNavOpts = {
  header: null,
}

const navOptScreenWCancel = {
  headerStyle: {
    backgroundColor:
      Platform.OS === 'android'
        ? JolocomTheme.primaryColorBlack
        : JolocomTheme.primaryColorGrey,
  },
  headerBackImage,
  ...Platform.select({
    ios: {
      headerBackTitleStyle: {
        color: JolocomTheme.primaryColorPurple,
      },
      headerTintColor: { color: JolocomTheme.primaryColorPurple },
    },
  }),
}

const defaultHeaderBackgroundColor =
  Platform.OS === 'android'
    ? JolocomTheme.primaryColorBlack
    : JolocomTheme.primaryColorGrey

const defaultHeaderTintColor =
  Platform.OS === 'android'
    ? JolocomTheme.primaryColorWhite
    : JolocomTheme.primaryColorBlack

const commonNavigationOptions: NavigationScreenOptions = {
  headerTitleStyle: {
    fontSize: JolocomTheme.headerFontSize,
    fontFamily: JolocomTheme.contentFontFamily,
    fontWeight: '300',
  },

  headerStyle: {
    backgroundColor: defaultHeaderBackgroundColor,
    borderBottomWidth: 0,
  },
  headerTintColor: defaultHeaderTintColor,
}

const bottomNavBarBackground =
  Platform.OS == 'android'
    ? '#fafafa' // FIXME add to theme
    : JolocomTheme.primaryColorBlack

export const BottomTabNavRoutes = {
  [routeList.Claims]: {
    screen: Claims,
    title: 'My identity',
    navigationOptions: {
      tabBarIcon: IdentityMenuIcon,
    }
  },
  [routeList.Documents]: {
    screen: Interactions,
    title: 'Documents',
    navigationOptions: () => ({
      ...commonNavigationOptions,
      tabBarIcon: (props: {
        tintColor: string
        focused: boolean
        fillColor?: string
      }) => {
        props.fillColor = bottomNavBarBackground
        return new DocumentsMenuIcon(props)
      },
    }),
  },
  [routeList.Records]: {
    screen: Records,
    title: 'Login records',
    navigationOptions: () => ({
      ...commonNavigationOptions,
      tabBarIcon: RecordsMenuIcon,
    }),
  },
  [routeList.Settings]: {
    screen: Settings,
    title: 'Settings',
    navigationOptions: () => ({
      ...commonNavigationOptions,
      tabBarIcon: SettingsMenuIcon,
    }),
  },
}

const BottomTabNavigator = createBottomTabNavigator(BottomTabNavRoutes, {
  tabBarOptions: {
    ...Platform.select({
      android: {
        activeTintColor: JolocomTheme.primaryColorPurple,
        inactiveTintColor: '#9B9B9E', // FIXME
      },
      ios: {
        activeTintColor: JolocomTheme.primaryColorWhite,
        inactiveTintColor: 'rgba(255, 255, 255, 0.5)',
      },
    }),
    showLabel: false,
    style: {
      height: 50,
      bottom: 0,
      backgroundColor: bottomNavBarBackground,
    },
  },
  navigationOptions: (
    { navigation }: { navigation: NavigationScreenProp<NavigationRoute> }
  ) => {
    // proxy the route title as the headerTitle for this screen
    const nestedRouteName = navigation.state.routes[navigation.state.index].routeName
    return {
      headerTitle: I18n.t(BottomTabNavRoutes[nestedRouteName].title)
    }
  },
  //tabBarComponent: BottomNavBar,
  //tabBarPosition: 'bottom',
})

export const Routes = createStackNavigator({
  [routeList.Landing]: { screen: Landing, navigationOptions: noHeaderNavOpts },
  [routeList.Entropy]: { screen: Entropy, navigationOptions: noHeaderNavOpts },
  [routeList.Loading]: { screen: Loading, navigationOptions: noHeaderNavOpts },
  [routeList.SeedPhrase]: { screen: SeedPhrase, navigationOptions: noHeaderNavOpts },

  [routeList.Home]: {
    screen: BottomTabNavigator
  },
  [routeList.QRCodeScanner]: {
    screen: QRScannerContainer,
    navigationOptions: () => ({
      ...navOptScreenWCancel,
    }),
  },

  [routeList.CredentialDialog]: {
    screen: CredentialReceive,
    navigationOptions: () => ({
      headerTitle: I18n.t('Receiving new credential'),
      ...commonNavigationOptions,
    }),
  },
  [routeList.Consent]: {
    screen: Consent,
    navigationOptions: () => ({
      headerTitle: I18n.t('Share claims'),
      ...commonNavigationOptions,
    }),
  },
  [routeList.PaymentConsent]: {
    screen: PaymentConsent,
    navigationOptions: () => ({
      headerBackImage,
      headerTitle: I18n.t('Confirm payment'),
      ...commonNavigationOptions,
    }),
  },
  [routeList.AuthenticationConsent]: {
    screen: AuthenticationConsent,
    navigationOptions: () => ({
      headerBackImage,
      headerTitle: I18n.t('Authorization request'),
      ...commonNavigationOptions,
    }),
  },
  [routeList.ClaimDetails]: {
    screen: ClaimDetails,
    navigationOptions: () => navOptScreenWCancel,
  },
  [routeList.Exception]: { screen: Exception, navigationOptions: noHeaderNavOpts },
},
  {
    defaultNavigationOptions: commonNavigationOptions
  }

)
