import { StackNavigator, TabBarTop, TabNavigator } from 'react-navigation'
import { Claims, Interactions, ClaimDetails } from 'src/ui/home/'
import { Landing } from 'src/ui/landing/'
import { PasswordEntry, SeedPhrase, Loading, Entropy } from 'src/ui/registration/'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Exception } from 'src/ui/generic/'
import { Consent } from 'src/ui/sso'
import { CredentialReceive } from 'src/ui/home'

const navigationOptions = {
  header: null
}

const navOptScreenWCancel = {
  headerStyle: { backgroundColor: JolocomTheme.primaryColorBlack },
  headerBackImage: require('./resources/img/close.png')
}

export const HomeRoutes = TabNavigator(
  {
    Claims: {
      screen: Claims,
      navigationOptions: {
        tabBarLabel: 'All claims',
        headerTitle: 'My identity',
        headerTitleStyle: {
          fontSize: JolocomTheme.headerFontSize,
          fontFamily: JolocomTheme.contentFontFamily,
          fontWeight: '300'
        },
        headerStyle: { backgroundColor: JolocomTheme.primaryColorBlack },
        headerTintColor: JolocomTheme.primaryColorWhite
      }
    },
    Interactions: {
      screen: Interactions,
      navigationOptions: {
        tabBarLabel: 'Documents',
        headerTitle: 'My identity',
        headerTitleStyle: {
          fontSize: JolocomTheme.headerFontSize,
          fontFamily: JolocomTheme.contentFontFamily,
          fontWeight: '300'
        },
        headerStyle: {
          backgroundColor: JolocomTheme.primaryColorBlack
        },
        headerTintColor: JolocomTheme.primaryColorWhite
      }
    }
  },
  {
    tabBarOptions: {
      upperCaseLabel: false,
      activeTintColor: JolocomTheme.primaryColorSand,
      inactiveTintColor: JolocomTheme.primaryColorGrey,
      labelStyle: {
        fontFamily: JolocomTheme.contentFontFamily,
        fontSize: JolocomTheme.labelFontSize,
        textAlign: 'center'
      },
      style: {
        backgroundColor: JolocomTheme.primaryColorBlack
      },
      indicatorStyle: {
        backgroundColor: JolocomTheme.primaryColorSand
      }
    },
    tabBarComponent: TabBarTop,
    tabBarPosition: 'bottom'
  }
)

export const Routes = StackNavigator({
  Landing: { screen: Landing, navigationOptions },
  Entropy: { screen: Entropy, navigationOptions },
  Loading: { screen: Loading, navigationOptions },
  PasswordEntry: { screen: PasswordEntry, navigationOptions },
  SeedPhrase: { screen: SeedPhrase, navigationOptions },
  Home: { screen: HomeRoutes },
  // TODO Add title, color
  CredentialDialog: {
    screen: CredentialReceive,
    navigationOptions: {
      headerTitle: 'Receiving new credential',
      headerTitleStyle: {
        fontFamily: JolocomTheme.contentFontFamily,
        fontWeight: '100',
        fontSize: JolocomTheme.headerFontSize
      },
      headerStyle: { backgroundColor: JolocomTheme.primaryColorBlack },
      headerTintColor: JolocomTheme.primaryColorWhite
    }
  },
  Consent: {
    screen: Consent,
    navigationOptions: {
      headerTitle: 'Share claims',
      headerTitleStyle: {
        fontFamily: JolocomTheme.contentFontFamily,
        fontWeight: '100',
        fontSize: JolocomTheme.headerFontSize
      },
      headerStyle: { backgroundColor: JolocomTheme.primaryColorBlack },
      headerTintColor: JolocomTheme.primaryColorWhite
    }
  },
  Exception: { screen: Exception, navigationOptions },
  ClaimDetails: { screen: ClaimDetails, navigationOptions: navOptScreenWCancel }
})
