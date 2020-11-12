import 'react-native-gesture-handler'
import 'crypto'
import React from 'react'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { I18nextProvider } from 'react-i18next'

import RootNavigation from '~/RootNavigation'
import { ErrorBoundary } from '~/ErrorBoundary'
import { AgentContextProvider } from '~/utils/sdk/context'
import configureStore from './configureStore'
import Overlays from '~/Overlays'
import { i18n } from '~/translations'

const store = configureStore()

const App = () => {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
          <Provider store={store}>
            <AgentContextProvider>
              <Overlays />
              <RootNavigation />
            </AgentContextProvider>
          </Provider>
        </ErrorBoundary>
      </I18nextProvider>
    </SafeAreaProvider>
  )
}

export default App
