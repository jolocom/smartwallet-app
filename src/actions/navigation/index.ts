import { NavigationActions, NavigationNavigateActionPayload } from 'react-navigation'

export const navigate = (options: NavigationNavigateActionPayload) => {
  return NavigationActions.navigate(options)
}

export const goBack = () => {
  return NavigationActions.back()
}

export const navigatorReset = (screen: NavigationNavigateActionPayload) => {
  return NavigationActions.reset({
    index:0,
    actions: [navigate(
      screen
    )]
  })
}