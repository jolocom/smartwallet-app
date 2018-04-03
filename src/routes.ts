import { StackNavigator } from 'react-navigation'
import { Loading } from './ui'
import { Home } from 'src/ui/home/containers/Home'
import { SeedPhrase } from 'src/ui/registration/containers/seedPhrase'

export const RootStack = StackNavigator({
    Home: {
      screen: Home
    },
    Loading: {
      screen: Loading
    },
    SeedPhrase: {
      screen: SeedPhrase
    }
  }, {
    initialRouteName: 'SeedPhrase',
    headerMode: 'none'
  },
)
