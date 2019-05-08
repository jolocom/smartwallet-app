import React from 'react'
import { Provider } from 'react-redux'
import { Navigator } from 'src/NavigatorContainer'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { initStore } from './store'

const { ThemeProvider } = require('react-native-material-ui')
const assign = require('object.assign/implementation')
Object.assign = assign

const App = () => {
  const store = initStore()
  return (
    <ThemeProvider uiTheme={JolocomTheme}>
      <Provider store={store}>
        <Navigator dispatch={store.dispatch} />
      </Provider>
    </ThemeProvider>
  )
}

export default App
