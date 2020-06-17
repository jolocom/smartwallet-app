import { AccountState, Action, AccountActionTypes } from './types'

const initialState: AccountState = {
  did: '',
  entropy: '',
  loggedIn: false,
  isAppLocked: true,
  isLocalAuthSet: false, // this value indicates where user went through local auth registration
}

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case AccountActionTypes.setDid:
      return { ...state, did: action.payload }
    case AccountActionTypes.resetAccount:
      return initialState
    case AccountActionTypes.setLogged:
      return { ...state, loggedIn: action.payload }
    case AccountActionTypes.lockApp:
      return { ...state, isAppLocked: true }
    case AccountActionTypes.unlockApp:
      return { ...state, isAppLocked: false }
    case AccountActionTypes.setLocalAuth:
      return { ...state, isLocalAuthSet: true }
    case AccountActionTypes.setEntropy:
      return { ...state, entropy: action.payload }
    default:
      return state
  }
}

export default reducer
