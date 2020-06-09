import 'react-native-gesture-handler'
import 'crypto'
import React from 'react'
import { Provider } from 'react-redux'

import RootNavigation from '~/RootNavigation'
import { ErrorBoundary } from '~/ErrorBoundary'
import Loader from '~/components/Loader'
import configureStore from './configureStore'
import { SDKContextProvider } from '~/utils/sdk/context'

const store = configureStore()

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SDKContextProvider>
          <RootNavigation />
        </SDKContextProvider>
        <Loader />
      </Provider>
    </ErrorBoundary>
  )
}

export default App
