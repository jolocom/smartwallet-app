import * as React from 'react'
import {StackNavigator} from 'react-navigation'
import {View} from 'react-native'
import Home from './src/components/Home'

const RootStack = StackNavigator(
  {
    Home: { screen: Home }
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return (
      <RootStack />
    )
  }
}