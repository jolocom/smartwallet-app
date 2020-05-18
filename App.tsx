import 'react-native-gesture-handler'
import './shim'
import 'crypto'
import React from 'react'
import { Provider } from 'react-redux'

import RootNavigation from '~/RootNavigation'
import { ErrorBoundary } from '~/ErrorBoundary'
import configureStore from './configureStore'

const store = configureStore()

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <RootNavigation />
      </Provider>
    </ErrorBoundary>
  )
}

export default App
