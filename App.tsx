import * as React from 'react'
import {Provider} from 'react-redux'
import {View} from 'react-native'
import {RootStack} from './src/routes'
import {store} from './src/store'
import { ThemeProvider } from 'react-native-material-ui'
import { JolocomTheme } from 'src/styles/jolocom-theme'


// tslint:disable-next-line: no-default-export
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider uiTheme={JolocomTheme}>
          <RootStack />
        </ThemeProvider>
      </Provider>
    )
  }
}
