import { AccountState, Action, AccountActionTypes } from './types'

const initialState: AccountState = {
  did: '',
  loggedIn: true, // 🧨 for testing only should be false after implementation is complete
  isAppLocked: true,
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
    default:
      return state
  }
}

export default reducer
