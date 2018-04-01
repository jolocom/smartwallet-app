import { StackNavigator, } from 'react-navigation'
import { Home } from 'src/ui/home/'
import { Landing } from 'src/ui/landing/'
import { PasswordEntry, SeedPhrase } from 'src/ui/registration'

export const enum routeList {
  Landing = 'Landing',
  PasswordEntry = 'PasswordEntry',
  SeedPhrase = 'SeedPhrase',
  Home = 'Home'
}

export const Routes = StackNavigator({
    Landing: { screen: Landing },
    PasswordEntry: { screen: PasswordEntry },
    SeedPhrase: { screen: SeedPhrase },
    Home: { screen: Home }
  }, {
    headerMode: 'none'
  }
)
