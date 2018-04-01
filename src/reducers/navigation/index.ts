import { AnyAction } from 'redux'
import { NavigationStackAction } from 'react-navigation'
import { Routes } from 'src/routes'

const action = Routes.router.getActionForPathAndParams('Landing')
const initialState = Routes.router.getStateForAction(action as NavigationStackAction)

export const navigation = (state = initialState, action: NavigationStackAction) => {
  const nextState = Routes.router.getStateForAction(action, state)
  return nextState || state
}
