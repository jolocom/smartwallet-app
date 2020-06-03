import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import './shim'

import RootNavigation from '~/RootNavigation'
import { ErrorBoundary } from '~/ErrorBoundary'
import Loader from '~/components/Loader'
import configureStore from './configureStore'

const store = configureStore()

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <RootNavigation />
        <Loader />
      </Provider>
    </ErrorBoundary>
  )
}

export default App
