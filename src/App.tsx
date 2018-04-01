import * as React from 'react'
import { Provider } from 'react-redux'
import { NavigatorComponent } from 'src/routes'
import { store } from 'src/store'

const { ThemeProvider } = require ('react-native-material-ui')

// tslint:disable-next-line: no-default-export
export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider uiTheme={{}}>
        <Provider store={ store }>
          <NavigatorComponent />
        </Provider>
      </ThemeProvider>
    )
  }
}
