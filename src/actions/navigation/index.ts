import {
  NavigationActions,
  NavigationNavigateActionPayload,
} from 'react-navigation'
import { AnyAction, Dispatch } from 'redux'
import { ssoActions } from 'src/actions/'
import { toggleLoading } from '../account'
import { BackendMiddleware } from 'src/backendMiddleware'
import { setDeepLinkLoading, toggleDeepLinkFlag } from '../sso'
import { routeList } from 'src/routeList'

export const navigate = (options: NavigationNavigateActionPayload) =>
  NavigationActions.navigate(options)

export const goBack = () => NavigationActions.back()

export const navigatorReset = (newScreen: NavigationNavigateActionPayload) =>
  NavigationActions.reset({
    index: 0,
    actions: [navigate(newScreen)],
  })

/**
 * The function that parses a deep link to get the route name and params
 * It then matches the route name and dispatches a corresponding action
 * @param url - a deep link string with the following schema: appName://routeName/params
 */
export const handleDeepLink = (url: string) => async (
  dispatch: Dispatch<AnyAction>,
  getState: Function,
  backendMiddleware: BackendMiddleware,
) => {
  dispatch(toggleLoading(true))
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
      dispatch(toggleLoading(false))
      dispatch(navigatorReset({ routeName: routeList.Landing }))
      return
    }

    dispatch(setDeepLinkLoading(true))
    dispatch(toggleDeepLinkFlag(true))
    dispatch(ssoActions.parseJWT(params))
  }
}
