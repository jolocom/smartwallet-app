import {StackNavigator} from 'react-navigation'
import * as components from './components/'

export const RootStack = StackNavigator({
    Home: { screen: components.Home }
  }, {
    initialRouteName: 'Home'
  }
)
