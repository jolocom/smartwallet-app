import { NavigationActions, NavigationNavigateActionPayload } from 'react-navigation'
import { routeList } from 'src/routes'

export const navigate = (options: NavigationNavigateActionPayload) => {
  return NavigationActions.navigate(options)
}

export const goBack = () => {
  return NavigationActions.back()
}
