import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { LoadingState } from 'src/reducers/account/'

const initialState : LoadingState = {
  loading: true
}

export const loadingState = (state = Immutable.fromJS(initialState), action: AnyAction): string => {
  switch (action.type) {
    case 'SET_LOADING':
      return state.setIn(['loading'], action.value)
    default:
      return state
  }
}