import * as React from 'react'
import {Provider} from 'react-redux'
import {View} from 'react-native'
import {RootStack} from './src/routes'
import {store} from './src/store'

export class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    )
  }
}