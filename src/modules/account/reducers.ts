import { AccountState, Action, AccountActionTypes } from './types'

const initialState: AccountState = {
  did: '',
}

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case AccountActionTypes.setDid:
      return action.payload
    case AccountActionTypes.resetAccount:
      return initialState
    default:
      return state
  }
}

export default reducer
