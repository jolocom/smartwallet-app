import { StackNavigator, } from 'react-navigation'
import { Home } from 'src/ui/home/containers/home'
import { Landing } from 'src/ui/landing/'
import { PasswordEntry, Loading, SeedPhrase } from 'src/ui/registration'

export const enum routeList {
  Landing = 'Landing',
  Loading = 'Loading',
  PasswordEntry = 'PasswordEntry',
  SeedPhrase = 'SeedPhrase',
  Home = 'Home'
}

const navigationOptions = {
  header: null
}

export const Routes = StackNavigator({
    Landing: { screen: Landing, navigationOptions },
    PasswordEntry: { screen: PasswordEntry, navigationOptions },
    Loading: { screen: Loading, navigationOptions },
    SeedPhrase: { screen: SeedPhrase, navigationOptions },
    Home: { screen: Home, navigationOptions }
  }
)
