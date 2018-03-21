import * as React from 'react'
import {View} from 'react-native'

import {RootStack} from './src/routes'

export default class App extends React.Component {
  render() {
    return (
      <RootStack />
    )
  }
}