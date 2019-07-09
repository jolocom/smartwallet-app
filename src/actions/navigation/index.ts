import {
  NavigationActions,
  StackActions,
  NavigationNavigateActionPayload,
  NavigationResetAction,
} from 'react-navigation'
import { setDeepLinkLoading } from 'src/actions/sso'
import { routeList } from 'src/routeList'
import { JolocomLib } from 'jolocom-lib'
import { interactionHandlers } from '../../lib/storage/interactionTokens'
import { showErrorScreen } from '../generic'
import { AppError, ErrorCode } from '../../lib/errors'
import { withErrorHandling, withLoading } from 'src/actions/modifiers'
import { ThunkAction } from '../../store'

export const navigate = (options: NavigationNavigateActionPayload) =>
  NavigationActions.navigate(options)

export const goBack = NavigationActions.back()

export const navigatorReset = (
  newScreen: NavigationNavigateActionPayload,
): NavigationResetAction =>
  StackActions.reset({
    index: 0,
    actions: [navigate(newScreen)],
  })

export const navigatorResetHome = (): NavigationResetAction => navigatorReset({ routeName: routeList.Home })

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
      return dispatch(navigatorReset({ routeName: routeList.Landing }))
    }

    const interactionToken = JolocomLib.parse.interactionToken.fromJWT(params)
    const handler = interactionHandlers[interactionToken.interactionType]

    if (handler) {
      return dispatch(
        withLoading(setDeepLinkLoading)(
          withErrorHandling(showErrorScreen)(handler(interactionToken, true)),
        ),
      )
    }

    /** @TODO Use error code */
    return dispatch(
      showErrorScreen(
        new AppError(ErrorCode.Unknown, new Error('No handler found')),
      ),
    )
  }

  /** @TODO Better return */
  return navigate({
    routeName: routeList.Home,
  })
}
