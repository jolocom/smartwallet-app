import {
  NavigationActions,
  StackActions,
  NavigationNavigateActionPayload,
  NavigationAction,
  NavigationContainerComponent,
} from 'react-navigation'
import { routeList } from 'src/routeList'
import { JolocomLib } from 'jolocom-lib'
import { interactionHandlers } from '../../lib/storage/interactionTokens'
import { showErrorScreen } from '../generic'
import { AppError, ErrorCode } from '../../lib/errors'
import { withErrorHandling, withLoading } from 'src/actions/modifiers'
import { ThunkAction } from '../../store'

let deferredNavActions: NavigationAction[] = [],
  dispatchNavigationAction = (action: any) => {
    deferredNavActions.push(action)
  }

export const setTopLevelNavigator = (nav: NavigationContainerComponent) => {
  dispatchNavigationAction = nav.dispatch.bind(nav)
  deferredNavActions.forEach(dispatchNavigationAction)
  deferredNavActions.length = 0
}

/**
 * NOTE: navigate and navigatorReset both dispatch the navigation actions but
 * the actions are not handled by our reducers. Dispatching is useful for testing
 * (comparing snapshots of store actions) and it makes typescript happy
 */
export const navigate = (
  options: NavigationNavigateActionPayload,
): ThunkAction => dispatch => {
  const action = NavigationActions.navigate(options)
  dispatchNavigationAction(action)
  return dispatch(action)
}

export const navigatorReset = (
  newScreen: NavigationNavigateActionPayload,
): ThunkAction => dispatch => {
  const action = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate(newScreen)],
  })
  dispatchNavigationAction(action)
  return dispatch(action)
}

export const navigatorResetHome = (): ThunkAction => dispatch =>
  dispatch(navigatorReset({ routeName: routeList.Home }))

/**
 * The function that parses a deep link to get the route name and params
 * It then matches the route name and dispatches a corresponding action
 * @param url - a deep link string with the following schema: appName://routeName/params
 */
export const handleDeepLink = (url: string): ThunkAction => (
  dispatch,
  getState,
  backendMiddleware,
) => {
  // TODO Fix
  const route: string = url.replace(/.*?:\/\//g, '')
  const params: string = (route.match(/\/([^\/]+)\/?$/) as string[])[1] || ''
  const routeName = route.split('/')[0]

  if (
    routeName === 'consent' ||
    routeName === 'payment' ||
    routeName === 'authenticate'
  ) {
    // The identityWallet is initialised before the deep link is handled.
    if (!backendMiddleware.identityWallet) {
      // FIXME WTF? does this happen?
      return dispatch(navigatorReset({ routeName: routeList.Landing }))
    }

    const interactionToken = JolocomLib.parse.interactionToken.fromJWT(params)
    const handler = interactionHandlers[interactionToken.interactionType]

    if (handler) {
      return dispatch(
        withLoading(
          withErrorHandling(showErrorScreen)(handler(interactionToken, true)),
        ),
      )
    }
  }

  /** @TODO Use error code */
  throw new AppError(
    ErrorCode.Unknown,
    new Error('Could not handle interaction token'),
  )
}
