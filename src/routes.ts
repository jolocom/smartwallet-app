import { StackNavigator } from 'react-navigation'
import { Home } from 'src/ui/home/'
import { SeedPhrase } from 'src/ui/registration'
import { Entropy } from 'src/ui/registration'


export const RootStack = StackNavigator({
    Home: {
      screen: Home
    },
    Entropy: { 
      screen: Entropy, 
      navigationOptions: { header: null} 
    },
    SeedPhrase: {
      screen: SeedPhrase,
      navigationOptions: { header: null} 
    },

  }, {
    initialRouteName: 'SeedPhrase'
  },
)
