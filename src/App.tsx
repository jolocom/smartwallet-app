import React from 'react'
import { Provider } from 'react-redux'
import { initStore } from './store'
import { navigationActions } from 'src/actions'
import { StatusBar } from 'react-native'
import { RoutesContainer } from './routes'
import { AppLoading } from './ui/generic/appLoading'
import { useScreens } from 'react-native-screens'
import { NavigationContainerComponent } from 'react-navigation'
import { Notification } from './ui/notifications/containers/notifications'
useScreens()

let store: ReturnType<typeof initStore>

export default class App extends React.PureComponent<{}> {
  private navigator!: NavigationContainerComponent

  public constructor(props: {}) {
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

  private setNavigator(nav: NavigationContainerComponent | null) {
    if (!nav) return
    this.navigator = nav
    navigationActions.setTopLevelNavigator(this.navigator)
  }

  public render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="default" />
        <Provider store={store}>
          <React.Fragment>
            <RoutesContainer ref={nav => this.setNavigator(nav)} />
            <AppLoading />
            <Notification />
          </React.Fragment>
        </Provider>
      </React.Fragment>
    )
  }
}
