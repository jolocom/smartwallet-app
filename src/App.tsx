import * as React from 'react'
import { Provider } from 'react-redux'
import { View } from 'react-native'
import { RootStack } from 'src/routes'
import { store } from 'src/store'
import { JolocomTheme } from 'src/styles/jolocom-theme'

const { ThemeProvider } = require ('react-native-material-ui')

// tslint:disable-next-line: no-default-export
export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider uiTheme={{}}>
        <Provider store={ store }>
          <RootStack />
        </Provider>
      </ThemeProvider>
    )
  }
}
