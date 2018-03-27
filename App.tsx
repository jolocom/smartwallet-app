import * as React from 'react'
import {Provider} from 'react-redux'
import {View} from 'react-native'
import {RootStack} from './src/routes'
import {store} from './src/store'
import { COLOR, ThemeProvider } from 'react-native-material-ui'

const uiTheme = {
  palette: {
    primaryColor: '#942f51',
  },
  toolbar: {
    container: {
      height: 50,
    }
  }
}

// tslint:disable-next-line: no-default-export
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider uiTheme={uiTheme}>
          <RootStack />
        </ThemeProvider>
      </Provider>
    )
  }
}
