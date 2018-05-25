import React from 'react'
import { Provider } from 'react-redux'
import { Navigator } from 'src/NavigatorContainer'
import { store } from 'src/store'
import { JolocomTheme } from 'src/styles/jolocom-theme'
const { ThemeProvider } = require ('react-native-material-ui')
const assign = require('object.assign/implementation')

Object.assign = assign

// tslint:disable-next-line: no-default-export
export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider uiTheme={ JolocomTheme }>
        <Provider store={ store }>
          <Navigator dispatch={ store.dispatch }/>
        </Provider>
      </ThemeProvider>
    )
  }
}
