import { StackNavigator, } from 'react-navigation'
import { Home } from 'src/ui/home/'
import { Landing } from 'src/ui/landing/'
import { PasswordEntry, SeedPhrase, Entropy } from 'src/ui/registration/'

export const enum routeList {
  Landing = 'Landing',
  Entropy = 'Entropy',
  PasswordEntry = 'PasswordEntry',
  SeedPhrase = 'SeedPhrase',
  Home = 'Home'
}

const navigationOptions = {
  header: null
}

export const Routes = StackNavigator({
    Landing: { screen: Landing, navigationOptions },
    Entropy: { screen: Entropy, navigationOptions},
    PasswordEntry: { screen: PasswordEntry, navigationOptions },
    SeedPhrase: { screen: SeedPhrase, navigationOptions },
    Home: { screen: Home, navigationOptions }
  }
)
