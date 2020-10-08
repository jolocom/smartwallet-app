import 'react-native-gesture-handler'
import 'crypto'
import React from 'react'
import { StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import RootNavigation from '~/RootNavigation'
import { ErrorBoundary } from '~/ErrorBoundary'
import { SDKContextProvider } from '~/utils/sdk/context'
import configureStore from './configureStore'
import Overlays from '~/Overlays'

const store = configureStore()

const App = () => {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <Provider store={store}>
          <StatusBar barStyle="light-content" />
          <SDKContextProvider>
            <Overlays />
            <RootNavigation />
          </SDKContextProvider>
        </Provider>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App
