import { NavigationActions, NavigationNavigateActionPayload } from 'react-navigation'
import { AnyAction, Dispatch } from 'redux'
import { ssoActions } from 'src/actions/'

export const navigate = (options: NavigationNavigateActionPayload) => {
  return NavigationActions.navigate(options)
}

export const goBack = () => {
  return NavigationActions.back()
}

export const navigatorReset = (newScreen: NavigationNavigateActionPayload) => {
  return NavigationActions.reset({
    index:0,
    actions: [navigate(newScreen)]
  })
}

/**
 * The function that parses a deep link to get the route name and params
 * It then matches the route name and dispatches a correcponding action
 * @param url - a deep link string with the following schemat: appName://routeName/params
 */
export const handleDeepLink = (url: string) => {
  return (dispatch: Dispatch<AnyAction>) => {
    const route: string = url.replace(/.*?:\/\//g, '')
    const params: string = (route.match(/\/([^\/]+)\/?$/) as string[])[1] || ''
    const routeName = route!.split('/')[0]

    if (routeName === 'consent') {
      dispatch(ssoActions.parseJWT(params))
    }
  }
}
