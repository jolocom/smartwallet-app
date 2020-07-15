import { AppStateStatus } from 'react-native'
import { AppStateActions } from './actions'
import { Action } from '~/types/actions'

const initialState = {
  isPopupOn: false,
}

const reducer = (
  state = initialState,
  action: Action<AppStateActions, AppStateStatus>,
) => {
  switch (action.type) {
    case AppStateActions.changePopupState:
      return action.payload
    default:
      return state
  }
}

export default reducer
