import 'react-native-gesture-handler'
import 'crypto'
import React, { useRef } from 'react'
import { Platform, UIManager } from 'react-native'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { I18nextProvider } from 'react-i18next'

import RootNavigation from '~/RootNavigation'
import { ErrorBoundary } from '~/errors/ErrorBoundary'
import { AgentContextProvider } from '~/utils/sdk/context'
import configureStore from './configureStore'
import Overlays from '~/Overlays'
import { NavigationContainerRef } from '@react-navigation/native'
import { i18n } from '~/translations'
import { ErrorContextProvider } from '~/errors/errorContext'

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
      <I18nextProvider i18n={i18n}>
        <ErrorContextProvider>
          <ErrorBoundary>
            <Provider store={store}>
              <AgentContextProvider>
                <Overlays navRef={navRef} />
                <RootNavigation ref={navRef} />
              </AgentContextProvider>
            </Provider>
          </ErrorBoundary>
        </ErrorContextProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  )
}

export default App
