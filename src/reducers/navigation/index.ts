import { AnyAction } from 'redux'
import { NavigationStackAction } from 'react-navigation'
import { AppNavigator } from 'src/routes'

const action = AppNavigator.router.getActionForPathAndParams('Landing')
const initialState = AppNavigator.router.getStateForAction(action as NavigationStackAction)

export const navigation = (state = initialState, action: NavigationStackAction) => {
  const nextState = AppNavigator.router.getStateForAction(action, state)
  return nextState || state
}
