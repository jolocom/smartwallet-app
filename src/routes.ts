import { StackNavigator } from 'react-navigation'
import { Home } from './ui/home/'
import { Landing } from './ui/landing/'
import { PasswordEntry } from './ui/registration'
import { SeedPhrase } from 'src/ui/registration/containers/seedPhrase'

export const RootStack = StackNavigator({
    Home: { screen: Home },
    Landing: { screen: Landing },
    PasswordEntry: { screen: PasswordEntry },
    SeedPhrase: { screen: SeedPhrase }
  }, {
    initialRouteName: 'Landing',
    headerMode: 'none'
  }
)
