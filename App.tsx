import * as React from 'react'
import {Provider} from 'react-redux'
import {View} from 'react-native'

import {RootStack} from './src/routes'
import Store from './src/store'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <RootStack />
      </Provider>
    )
  }
}