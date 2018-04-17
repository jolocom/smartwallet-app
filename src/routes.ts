import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import { Identity, Interactions } from 'src/ui/home/'
import { Landing } from 'src/ui/landing/'
import { PasswordEntry, SeedPhrase, Entropy } from 'src/ui/registration/'

export const enum routeList {
  Landing = 'Landing',
  Entropy = 'Entropy',
  PasswordEntry = 'PasswordEntry',
  SeedPhrase = 'SeedPhrase',
  Identity = 'Identity',
  Interactions = 'Interactions'
}

const navigationOptions = {
  header: null
}

export const HomeRoutes = TabNavigator(
  {
  Identity: { screen: Identity },
  Interactions: {screen: Interactions }
  },
  {
    tabBarOptions: {
      activeTintColor: 'purple',
      labelStyle: {
        fontSize: 20,
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
  PasswordEntry: { screen: PasswordEntry, navigationOptions },
  SeedPhrase: { screen: SeedPhrase, navigationOptions },
  Home: { screen: HomeRoutes }
})