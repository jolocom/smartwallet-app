import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import { Identity, Interactions } from 'src/ui/home/'
import { Landing } from 'src/ui/landing/'
import { PasswordEntry, SeedPhrase, Loading, Entropy } from 'src/ui/registration/'
import { JolocomTheme } from 'src/styles/jolocom-theme'

export const enum routeList {
  Landing = 'Landing',
  Entropy = 'Entropy',
  Loading = 'Loading',
  PasswordEntry = 'PasswordEntry',
  SeedPhrase = 'SeedPhrase',
  Identity = 'Identity',
  Interactions = 'Interactions'
}

const navigationOptions = {
  header: null
}

export const HomeRoutes = TabNavigator({
    Identity: { screen: Identity },
    Interactions: { screen: Interactions }
  }, {
    tabBarOptions: {
      activeTintColor: JolocomTheme.palette.primaryColor,
      labelStyle: {
        fontSize: JolocomTheme.textStyles.sectionheader.fontSize,
        textAlign: 'center' 
      }
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom'
  }
)

export const Routes = StackNavigator({
  Landing: { screen: Landing, navigationOptions },
  Entropy: { screen: Entropy, navigationOptions},
  Loading: { screen: Loading, navigationOptions },
  PasswordEntry: { screen: PasswordEntry, navigationOptions },
  SeedPhrase: { screen: SeedPhrase, navigationOptions },
  Home: { screen: HomeRoutes }
})
