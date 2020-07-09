import 'react-native-gesture-handler'
import 'crypto'
import React from 'react'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import RootNavigation from '~/RootNavigation'
import { ErrorBoundary } from '~/ErrorBoundary'
import Loader from '~/modals/Loader'
import Lock from '~/modals/Lock'
import { SDKContextProvider } from '~/utils/sdk/context'

import configureStore from './configureStore'
import ActionSheetContainer from '~/components/ActionSheetContainer'
import { StatusBar } from 'react-native'

const store = configureStore()

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <StatusBar barStyle="light-content" />
        <SafeAreaProvider>
          <SDKContextProvider>
            <ActionSheetContainer />
            <RootNavigation />
          </SDKContextProvider>
          <Loader />
          <Lock />
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
