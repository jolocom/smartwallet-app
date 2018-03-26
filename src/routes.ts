import { StackNavigator } from 'react-navigation'
import { Home } from './ui'
import { Loading } from './ui'

export const RootStack = StackNavigator({
    Home: { screen: Home },
    Loading: { screen: Loading }
  }, {
    initialRouteName: 'Home'
  }
)
