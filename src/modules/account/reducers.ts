import { AccountState, Action, AccountActionTypes } from './types'

const initialState: AccountState = {
  did: '',
  entropy: '',
  loggedIn: false,
}

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case AccountActionTypes.setDid:
      return { ...state, did: action.payload }
    case AccountActionTypes.resetAccount:
      return initialState
    case AccountActionTypes.setLogged:
      return { ...state, loggedIn: action.payload }
    case AccountActionTypes.setEntropy:
      return { ...state, entropy: action.payload }
    default:
      return state
  }
}

export default reducer
