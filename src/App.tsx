import React from 'react'
import { Provider } from 'react-redux'
import { ThemeContext, getTheme } from 'react-native-material-ui'
import { Navigator } from 'src/NavigatorContainer'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { initStore } from './store'

let store: ReturnType<typeof initStore>

const App = () => {
  // only init store once, or else Provider complains (especially on 'toggle
  // inspector')
  //
  // but it needs to be done only when a new App is
  // instantiated because otherwise the overrides at the top of index.ts will
  // have not been excuted yet (while files are being imported) and initStore
  // triggers creation of BackendMiddleware which needs those
  if (!store) store = initStore()

  return (
    <ThemeContext.Provider value={getTheme(JolocomTheme)}>
      <Provider store={store}>
        <Navigator dispatch={store.dispatch} />
      </Provider>
    </ThemeContext.Provider>
  )
}

export default App
