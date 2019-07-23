import React from 'react'
import { Provider } from 'react-redux'
import { ThemeContext, getTheme } from 'react-native-material-ui'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { initStore } from './store'
import { genericActions, accountActions, navigationActions } from 'src/actions'
import { Linking, BackHandler, StatusBar } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { withLoading, withErrorHandling } from './actions/modifiers'
import { toggleLoading } from './actions/account'
import { RoutesContainer } from './routes'

import { useScreens } from 'react-native-screens'
import { routeList } from './routeList'
useScreens()

let store: ReturnType<typeof initStore>

export default class App extends React.PureComponent<{}> {
  private navigator: any

  constructor(props: {}) {
    super(props)
    // only init store once, or else Provider complains (especially on 'toggle
    // inspector')
    //
    // but it needs to be done only when a new App is
    // instantiated because otherwise the overrides at the top of index.ts will
    // have not been excuted yet (while files are being imported) and initStore
    // triggers creation of BackendMiddleware which needs those
    if (!store) store = initStore()
  }

  /**
   * should return false if app exit is desired
   */
  private navigateBack = () => {
    if (!this.navigator) return

    let curState = this.navigator.state.nav
    while (true) {
      const { index, routes } = curState
      if (index !== undefined && routes) curState = routes[index]
      else break
    }

    if (curState.routeName === routeList.Claims) {
      // if we are on the first tab, pressing back should close down the app
      return false
    }

    this.navigator.dispatch(NavigationActions.back())

    return true
  }

  // When handleOpenURL is called, we pass the event url to the navigate method.
  private handleOpenURL(event: any) {
    this.handleDeepLink(event.url)
  }

  private handleDeepLink(url: string) {
    store.dispatch(
      withLoading(toggleLoading)(
        withErrorHandling(genericActions.showErrorScreen)(
          navigationActions.handleDeepLink(url),
        ),
      ),
    )
  }

  private setNavigator(nav: any) {
    if (!nav) return
    this.navigator = nav
    navigationActions.setTopLevelNavigator(this.navigator)
  }

  async componentDidMount() {
    await store.dispatch(genericActions.initApp)
    await store.dispatch(
      withLoading(accountActions.toggleLoading)(
        withErrorHandling(genericActions.showErrorScreen)(
          accountActions.checkIdentityExists,
        ),
      ),
    )
    const url = await Linking.getInitialURL()
    Linking.addEventListener('url', this.handleOpenURL)
    BackHandler.addEventListener('hardwareBackPress', this.navigateBack)

    if (url) {
      this.handleDeepLink(url)
    }
  }

  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="default" />
        <ThemeContext.Provider value={getTheme(JolocomTheme)}>
          <Provider store={store}>
            <RoutesContainer ref={nav => this.setNavigator(nav)} />
          </Provider>
        </ThemeContext.Provider>
      </React.Fragment>
    )
  }
}
