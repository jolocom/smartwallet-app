import { StackNavigator, TabBarTop, TabNavigator } from 'react-navigation'
import { Claims, ClaimDetails } from 'src/ui/home/'
import { Landing } from 'src/ui/landing/'
import { PaymentConsent } from 'src/ui/payment'
import {
  PasswordEntry,
  SeedPhrase,
  Loading,
  Entropy,
} from 'src/ui/registration/'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Exception } from 'src/ui/generic/'
import { Consent } from 'src/ui/sso'
import { CredentialReceive } from 'src/ui/home'
import I18n from 'src/locales/i18n'
import { QRScannerContainer } from 'src/ui/generic/qrcodeScanner'
import { AuthenticationConsent } from 'src/ui/authentication'
const backIcon = require('src/resources/img/left-chevron.png')

const navigationOptions = {
  header: null,
}

const navOptScreenWCancel = {
  headerStyle: { backgroundColor: JolocomTheme.primaryColorWhite },
  headerBackImage: backIcon,
  headerBackTitleStyle: { color: JolocomTheme.primaryColorPurple },
  headerTintColor: JolocomTheme.primaryColorPurple,
}

const headerTitleStyle = {
  fontSize: JolocomTheme.headerFontSize,
  fontFamily: JolocomTheme.contentFontFamily,
  fontWeight: '300',
}

const commonNavigationOptions = {
  headerTitleStyle,
  headerStyle: {
    backgroundColor: JolocomTheme.primaryColorWhite,
    borderBottomWidth: 0,
  },
  headerTintColor: JolocomTheme.primaryColorBlack,
}

export const HomeRoutes = TabNavigator(
  {
    Claims: {
      screen: Claims,
      navigationOptions: {
        tabBarLabel: I18n.t('All claims'),
        headerTitle: I18n.t('My identity'),
        ...commonNavigationOptions,
      },
    },
  },
  {
    tabBarOptions: {
      upperCaseLabel: false,
      activeTintColor: JolocomTheme.primaryColorPurple,
      inactiveTintColor: JolocomTheme.primaryColorGrey,
      labelStyle: {
        fontFamily: JolocomTheme.contentFontFamily,
        fontSize: JolocomTheme.labelFontSize,
        textAlign: 'center',
      },
      style: {
        backgroundColor: JolocomTheme.primaryColorWhite,
      },
      indicatorStyle: {
        backgroundColor: JolocomTheme.primaryColorPurple,
      },
    },
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
  },
)

export const Routes = StackNavigator({
  Landing: { screen: Landing, navigationOptions },
  Entropy: { screen: Entropy, navigationOptions },
  Loading: { screen: Loading, navigationOptions },
  PasswordEntry: { screen: PasswordEntry, navigationOptions },
  SeedPhrase: { screen: SeedPhrase, navigationOptions },
  Home: { screen: HomeRoutes },
  CredentialDialog: {
    screen: CredentialReceive,
    navigationOptions: {
      headerTitle: I18n.t('Receiving new credential'),
      headerTitleStyle: {
        fontFamily: JolocomTheme.contentFontFamily,
        fontWeight: '100',
        fontSize: JolocomTheme.headerFontSize,
      },
      headerStyle: { backgroundColor: JolocomTheme.primaryColorBlack },
      headerTintColor: JolocomTheme.primaryColorWhite,
    },
  },
  Consent: {
    screen: Consent,
    navigationOptions: {
      headerTitle: I18n.t('Share claims'),
      headerTitleStyle: {
        fontFamily: JolocomTheme.contentFontFamily,
        fontWeight: '100',
        fontSize: JolocomTheme.headerFontSize,
      },
      headerStyle: { backgroundColor: JolocomTheme.primaryColorBlack },
      headerTintColor: JolocomTheme.primaryColorWhite,
    },
  },
  PaymentConsent: {
    screen: PaymentConsent,
    navigationOptions: {
      headerBackImage: backIcon,
      headerBackTitleStyle: { color: JolocomTheme.primaryColorWhite },
      headerTitle: I18n.t('Confirm payment'),
      headerTitleStyle: {
        fontFamily: JolocomTheme.contentFontFamily,
        fontWeight: '100',
        fontSize: JolocomTheme.headerFontSize,
      },
      headerStyle: {
        backgroundColor: JolocomTheme.primaryColorBlack,
      },
      headerTintColor: JolocomTheme.primaryColorWhite,
    },
  },
  AuthenticationConsent: {
    screen: AuthenticationConsent,
    navigationOptions: {
      headerBackImage: backIcon,
      headerBackTitleStyle: { color: JolocomTheme.primaryColorWhite },
      headerTitle: I18n.t('Authorization request'),
      headerTitleStyle: {
        fontFamily: JolocomTheme.contentFontFamily,
        fontWeight: '100',
        fontSize: JolocomTheme.headerFontSize,
      },
      headerStyle: {
        backgroundColor: JolocomTheme.primaryColorBlack,
      },
      headerTintColor: JolocomTheme.primaryColorWhite,
    },
  },
  Exception: { screen: Exception, navigationOptions },
  ClaimDetails: {
    screen: ClaimDetails,
    navigationOptions: navOptScreenWCancel,
  },
  QRCodeScanner: {
    screen: QRScannerContainer,
    navigationOptions: navOptScreenWCancel,
  },
})
