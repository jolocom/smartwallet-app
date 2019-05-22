import { Platform } from 'react-native'
import { StackNavigator, TabBarTop, TabNavigator } from 'react-navigation'
import { Claims, Interactions, ClaimDetails } from 'src/ui/home/'
import { Landing } from 'src/ui/landing/'
import { PaymentConsent } from 'src/ui/payment'
import { SeedPhrase, Loading } from 'src/ui/registration/'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Exception, BottomNavBar } from 'src/ui/generic/'
import { Consent } from 'src/ui/sso'
import { CredentialReceive } from 'src/ui/home'
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

const headerBackImage =
  Platform.OS === 'android'
    ? require('./resources/img/close.png')
    : require('src/resources/img/left-chevron.png')

const navigationOptions = {
  header: null,
}

const navOptScreenWCancel = {
  headerStyle: {
    backgroundColor:
      Platform.OS === 'android'
        ? JolocomTheme.primaryColorBlack
        : JolocomTheme.primaryColorWhite,
  },
  headerBackImage,
  ...Platform.select({
    ios: {
      headerBackTitleStyle: { color: JolocomTheme.primaryColorPurple },
      headerTintColor: { color: JolocomTheme.primaryColorPurple },
    },
  }),
}

const headerTitleStyle = {
  fontSize: JolocomTheme.headerFontSize,
  fontFamily: JolocomTheme.contentFontFamily,
  fontWeight: '300',
}

const defaultHeaderBackgroundColor =
  Platform.OS === 'android'
    ? JolocomTheme.primaryColorBlack
    : JolocomTheme.primaryColorWhite

const defaultHeaderTintColor =
  Platform.OS === 'android'
    ? JolocomTheme.primaryColorWhite
    : JolocomTheme.primaryColorPurple

const commonNavigationOptions = {
  headerTitleStyle,
  headerStyle: {
    backgroundColor: defaultHeaderBackgroundColor,
    borderBottomWidth: 0,
  },
  headerTintColor: defaultHeaderTintColor,
}

export const IdentityRoutes = TabNavigator(
  {
    [routeList.Claims]: {
      screen: Claims,
      navigationOptions: {
        tabBarLabel: I18n.t('All claims'),
        headerTitle: I18n.t('My identity'),
        ...commonNavigationOptions,
      },
    },
    ...Platform.select({
      android: {
        [routeList.Interactions]: {
          screen: Interactions,
          navigationOptions: {
            tabBarLabel: I18n.t('Documents'),
            headerTitle: I18n.t('My identity'),
            ...commonNavigationOptions,
          },
        },
      },
    }),
  },
  {
    tabBarOptions: {
      upperCaseLabel: false,
      activeTintColor:
        Platform.OS === 'android'
          ? JolocomTheme.primaryColorSand
          : JolocomTheme.primaryColorPurple,
      inactiveTintColor: JolocomTheme.primaryColorGrey,
      labelStyle: {
        fontFamily: JolocomTheme.contentFontFamily,
        fontSize: JolocomTheme.labelFontSize,
        textAlign: 'center',
      },
      style: {
        backgroundColor: defaultHeaderBackgroundColor,
      },
      indicatorStyle: {
        backgroundColor:
          Platform.OS === 'android'
            ? JolocomTheme.primaryColorSand
            : JolocomTheme.primaryColorPurple,
      },
    },
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
  },
)

export const BottomNavRoutes = TabNavigator(
  {
    [routeList.Identity]: {
      screen: IdentityRoutes,
      navigationOptions: {
        tabBarIcon: IdentityMenuIcon,
      },
    },
    [routeList.Documents]: {
      screen: Interactions,
      navigationOptions: {
        tabBarIcon: DocumentsMenuIcon,
      },
    },
    [routeList.Records]: {
      screen: Interactions,
      navigationOptions: {
        tabBarIcon: RecordsMenuIcon,
      },
    },
    [routeList.Settings]: {
      screen: Interactions,
      navigationOptions: {
        tabBarIcon: SettingsMenuIcon,
      },
    },
  },
  {
    tabBarOptions: {
      // FIXME
      activeTintColor: JolocomTheme.primaryColorPurple,
      inactiveTintColor: '#9B9B9E', // FIXME

      showLabel: false,
      style: {
        height: 50,
        bottom: 0,
        ...Platform.select({
          android: {
            // FIXME
            backgroundColor: '#fafafa',
          },
          ios: {
            // FIXME
            backgroundColor: JolocomTheme.primaryColorBlack,
          },
        }),
      },
    },
    tabBarComponent: BottomNavBar,
    tabBarPosition: 'bottom',
  },
)

export const Routes = StackNavigator({
  [routeList.Landing]: { screen: Landing, navigationOptions },
  [routeList.Loading]: { screen: Loading, navigationOptions },
  [routeList.SeedPhrase]: { screen: SeedPhrase, navigationOptions },

  [routeList.Home]: { screen: BottomNavRoutes },
  [routeList.QRCodeScanner]: {
    screen: QRScannerContainer,
    navigationOptions: {
      ...navOptScreenWCancel,
      headerTitle: I18n.t('You can scan the qr code now!')
    }
  },

  [routeList.CredentialDialog]: {
    screen: CredentialReceive,
    navigationOptions: {
      headerTitle: I18n.t('Receiving new credential'),
      ...commonNavigationOptions,
    },
  },
  [routeList.Consent]: {
    screen: Consent,
    navigationOptions: {
      headerTitle: I18n.t('Share claims'),
      ...commonNavigationOptions,
    },
  },
  [routeList.PaymentConsent]: {
    screen: PaymentConsent,
    navigationOptions: {
      headerBackImage,
      headerTitle: I18n.t('Confirm payment'),
      ...commonNavigationOptions,
    },
  },
  [routeList.AuthenticationConsent]: {
    screen: AuthenticationConsent,
    navigationOptions: {
      headerBackImage,
      headerTitle: I18n.t('Authorization request'),
      ...commonNavigationOptions,
    },
  },
  [routeList.ClaimDetails]: {
    screen: ClaimDetails,
    navigationOptions: navOptScreenWCancel,
  },
  [routeList.Exception]: { screen: Exception, navigationOptions },
})
