import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { DidState } from 'src/reducers/account/'

const initialState : DidState = {
  did: ''
}

export const did = (state = Immutable.fromJS(initialState), action: AnyAction): string => {
  switch (action.type) {
    case 'DID_SET':
      return state.setIn(['did'], action.value)
    default:
      return state
  }
}
