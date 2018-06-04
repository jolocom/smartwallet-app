import { NavigationActions, NavigationNavigateActionPayload } from 'react-navigation'
import { routeList } from 'src/routeList'

export const navigate = (options: NavigationNavigateActionPayload) => {
  return NavigationActions.navigate(options)
}

export const goBack = () => {
  return NavigationActions.back()
}

export const navigatorReset = () => {
  return NavigationActions.reset({
    index:0,
    actions: [ 
      navigate({
        routeName: routeList.Home 
      })
    ]
  })
}