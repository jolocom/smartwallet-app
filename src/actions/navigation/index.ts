import { NavigationActions } from 'react-navigation'
import { routeList } from 'src/routes'

export const navigate = (route: routeList) => {
  return NavigationActions.navigate({ routeName: route })
}

export const goBack = () => {
  return NavigationActions.back()
}
