import { AnyAction } from 'redux'
import Immutable from 'immutable'

export interface AccountState {
  readonly did: string
}

const initialState : AccountState = {
  did: ''
}

export const accountReducer = (state = Immutable.fromJS(initialState), action: AnyAction): string => {
  switch (action.type) {
    case 'DID_SET':
      return state.setIn(['did'], action.value)
    default:
      return state
  }
}
