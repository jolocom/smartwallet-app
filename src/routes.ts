import {StackNavigator} from 'react-navigation'
import {Home} from './ui/home/'
import {SeedPhrase} from './ui/registration/containers/seedPhrase'

export const RootStack = StackNavigator({
    Home: {
      screen: Home
    },
    SeedPhrase: {
      screen: SeedPhrase
    }
  }, {
    initialRouteName: 'SeedPhrase',
    headerMode: 'none'
  },
)