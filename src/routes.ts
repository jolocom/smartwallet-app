import { StackNavigator, TabNavigator, TabBarTop} from 'react-navigation'
import { Claims, Interactions, ClaimDetails, Consent } from 'src/ui/home/'
import { Landing } from 'src/ui/landing/'
import { PasswordEntry, SeedPhrase, Loading, Entropy } from 'src/ui/registration/'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Exception } from 'src/ui/generic/'

const navigationOptions = {
  header: null
}

const navOptScreenWCancel = {
  headerStyle: { backgroundColor: JolocomTheme.primaryColorBlack },
  headerBackImage: require('./resources/img/close.png')
}

export const HomeRoutes = TabNavigator(
  {
    Identity: {
      screen: Claims,
      navigationOptions: {
        tabBarLabel: 'My identity',
        headerTitle: 'Jolocom ID Wallet',
        headerTitleStyle: {
          fontSize: JolocomTheme.labelFontSize 
        },
        headerStyle: { backgroundColor: JolocomTheme.primaryColorBlack },
        headerTintColor: JolocomTheme.primaryColorWhite
      }
    },
    Interactions: {
      screen: Interactions,
      navigationOptions: {
        tabBarLabel: 'Data history',
        headerTitle: 'Jolocom ID Wallet',
        headerTitleStyle: {
          fontSize: JolocomTheme.labelFontSize
        },
        headerStyle: {
          backgroundColor: JolocomTheme.primaryColorBlack,
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
  Entropy: { screen: Entropy, navigationOptions},
  Loading: { screen: Loading, navigationOptions },
  PasswordEntry: { screen: PasswordEntry, navigationOptions },
  SeedPhrase: { screen: SeedPhrase, navigationOptions },
  Home: { screen: HomeRoutes },
  Consent: { screen: Consent,
    navigationOptions:{
      headerTitle: 'Share claims',
      headerTitleStyle: {
        fontFamily: JolocomTheme.contentFontFamily,
        fontWeight: "100",
        fontSize: JolocomTheme.headerFontSize
      },
      headerStyle: {
        backgroundColor: JolocomTheme.primaryColorBlack,
      },
      headerTintColor: JolocomTheme.primaryColorWhite
    } 
  },
  Exception: { screen: Exception, navigationOptions },
  ClaimDetails: { screen: ClaimDetails, navigationOptions: navOptScreenWCancel }
})
