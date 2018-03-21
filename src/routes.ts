import {StackNavigator} from 'react-navigation'
import {Home} from './ui/home/'

export const RootStack = StackNavigator({
    Home: { screen: Home }
  }, {
    initialRouteName: 'Home'
  }
)
