import 'react-native-gesture-handler'
import 'crypto'
import React, { useRef } from 'react'
import { Platform, UIManager } from 'react-native'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import RootNavigation from '~/RootNavigation'
import { ErrorBoundary } from '~/ErrorBoundary'
import { AgentContextProvider } from '~/utils/sdk/context'
import configureStore from './configureStore'
import Overlays from '~/Overlays'
import { NavigationContainerRef } from '@react-navigation/native'

const store = configureStore()

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

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
