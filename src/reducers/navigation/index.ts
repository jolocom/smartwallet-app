import { AnyAction } from 'redux'
import { NavigationStackAction, NavigationActions } from 'react-navigation'
import { Routes } from 'src/routes'

const action = NavigationActions.navigate({ routeName: 'Landing' })
const initialState = Routes.router.getStateForAction(action)

export const navigationReducer = (state = initialState, action: NavigationStackAction) => {
  const nextState = Routes.router.getStateForAction(action, state)
  return nextState || state
}
