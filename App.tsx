import 'react-native-gesture-handler'
import 'crypto'
import React from 'react'
import { Provider } from 'react-redux'

import RootNavigation from '~/RootNavigation'
import { ErrorBoundary } from '~/ErrorBoundary'
import Loader from '~/components/Loader'
import Lock from '~/components/Lock'
import { SDKContextProvider } from '~/utils/sdk/context'

import configureStore from './configureStore'

const store = configureStore()

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SDKContextProvider>
          <RootNavigation />
        </SDKContextProvider>
        <Loader />
        <Lock />
      </Provider>
    </ErrorBoundary>
  )
}

export default App
