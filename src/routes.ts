import { StackNavigator } from 'react-navigation'
import { Home } from 'src/ui/home/'
import { SeedPhrase } from 'src/ui/registration/containers/seedPhrase'

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
