import 'react-native-gesture-handler'
import 'crypto'
import React from 'react'
import { Provider } from 'react-redux'

import RootNavigation from '~/RootNavigation'
import { ErrorBoundary } from '~/ErrorBoundary'
import Loader from '~/modals/Loader'
import Lock from '~/modals/Lock'
import { SDKContextProvider } from '~/utils/sdk/context'

import configureStore from './configureStore'
import ActionSheetContainer from '~/screens/Modals/Interactions/ActionSheetContainer'

const store = configureStore()

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SDKContextProvider>
          <ActionSheetContainer />
          <RootNavigation />
        </SDKContextProvider>
        <Loader />
        <Lock />
      </Provider>
    </ErrorBoundary>
  )
}

export default App
