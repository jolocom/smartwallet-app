import { StackNavigator } from 'react-navigation'
import { Home } from './ui/home/'
import { Landing } from './ui/landing/'
import { PasswordEntry } from './ui/registration'

export const RootStack = StackNavigator({
    Home: { screen: Home },
    Landing: { screen: Landing },
    PasswordEntry: { screen: PasswordEntry}
  }, {
    initialRouteName: 'Landing'
  }
)
