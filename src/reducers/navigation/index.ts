import { NavigationStackAction, NavigationActions } from 'react-navigation'
import { Routes } from 'src/routes'
import { routeList } from 'src/routeList'

const action = NavigationActions.navigate({ routeName: routeList.Entropy})
const initialState = Routes.router.getStateForAction(action)

export const navigationReducer = (state = initialState, action: NavigationStackAction) => {
  const nextState = Routes.router.getStateForAction(action, state)
  return nextState || state
}
