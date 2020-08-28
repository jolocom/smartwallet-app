import React from 'react'
import { View } from 'react-native'
import { Provider } from 'react-redux'
import { initStore, initTypeorm, ThunkDispatch } from './store'
import { navigationActions } from 'src/actions'
import { RoutesContainer } from './routes'
import { enableScreens } from 'react-native-screens'
import { isNil } from 'ramda'
import {
  NavigationContainerComponent,
  NavigationRoute,
  NavigationState,
} from 'react-navigation'
import { setActiveNotificationFilter } from './actions/notifications'
import { AppWrap } from './ui/structure/wrapper'
import Lock from './ui/deviceauth/Lock'
import RegisterPIN from './ui/deviceauth/RegisterPIN'

import {
  JolocomLinking,
  JolocomWebSockets,
  JolocomKeychainPasswordStore,
  JolocomSDK,
} from 'react-native-jolocom'
import HowToChangePIN from './ui/deviceauth/HowToChangePIN'

enableScreens()

/**
 * NOTE: this is *not* exported on purpose
 * Other parts of the app should generally *not* access the store directly, but
 * rather through being connect()ed through redux
 *
 * If you think you need to export this, then something else probably needs
 * better architecture.
 */
let store: ReturnType<typeof initStore>
let sdkPromise: Promise<JolocomSDK>

export default class App extends React.PureComponent<
  {},
  { ready: boolean; showStatusBar: boolean }
> {
  private navigator!: NavigationContainerComponent

  public constructor(props: {}) {
    super(props)
    this.state = {
      ready: false,
      showStatusBar: true,
    }
    // only init store once, or else Provider complains (especially on 'toggle
    // inspector')
    //
    // but it needs to be done only when a new App is
    // instantiated because otherwise the overrides at the top of index.ts will
    // have not been excuted yet (while files are being imported) and initStore
    // triggers creation of BackendMiddleware which needs those
    if (!sdkPromise) {
      sdkPromise = initTypeorm().then(async storage => {
        const passwordStore = new JolocomKeychainPasswordStore()
        const sdk = new JolocomSDK({ storage, passwordStore })
        await sdk.usePlugins(new JolocomLinking(), new JolocomWebSockets())
        sdk.setDefaultDidMethod('jun')

        store = initStore(sdk)
        this.setState({ ready: true })
        return sdk
      })
    }
  }

  public handleNavigationChange(
    prevState: NavigationState,
    newState: NavigationState,
  ) {
    // @ts-ignore
    let navigation = this.navigator._navigation
    let curState: NavigationState | NavigationRoute = newState,
      navigationOptions

    while (curState.routes) {
      const nextState: NavigationRoute = curState.routes[curState.index]
      const childNav = navigation.getChildNavigation(nextState.key)
      try {
        // NOTE
        // this throws for mysterious reasons sometimes
        // specifically, when using navigateBackHome(), so
        navigationOptions = navigation.router.getScreenOptions(childNav)
      } catch {
        // we just assume it means dead end
        break
      }

      curState = nextState
      navigation = childNav
    }

    const { notifications } = navigationOptions

    if (!isNil(notifications)) {
      const thunkDispatch: ThunkDispatch = store.dispatch
      thunkDispatch(setActiveNotificationFilter(notifications))
    }
  }

  private setNavigator(nav: NavigationContainerComponent | null) {
    if (!nav) return
    this.navigator = nav
    navigationActions.setTopLevelNavigator(this.navigator)
  }

  public render() {
    const { ready } = this.state
    return (
      <>
        {!ready ? (
          <View />
        ) : (
          <Provider store={store}>
            <AppWrap>
              <RoutesContainer
                onNavigationStateChange={this.handleNavigationChange.bind(this)}
                ref={nav => this.setNavigator(nav)}
              />
              <Lock />
              <RegisterPIN />
              <HowToChangePIN />
            </AppWrap>
          </Provider>
        )}
      </>
    )
  }
}
