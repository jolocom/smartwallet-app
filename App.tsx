import 'react-native-gesture-handler'
import 'crypto'
import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import RootNavigation from '~/RootNavigation'
import { ErrorBoundary } from '~/ErrorBoundary'
import { AgentContextProvider } from '~/utils/sdk/context'
import configureStore from './configureStore'
import Overlays from '~/Overlays'
import { NavigationContainerRef } from '@react-navigation/native'

const store = configureStore()

const App = () => {
  const navRef = useRef<NavigationContainerRef>(null)

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <Provider store={store}>
          <AgentContextProvider>
            <Overlays navRef={navRef} />
            <RootNavigation ref={navRef} />
          </AgentContextProvider>
        </Provider>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App
