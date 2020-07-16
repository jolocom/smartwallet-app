import { AccountState, AccountActions } from './types'
import { Action } from '~/types/actions'

const initialState: AccountState = {
  did: '',
  entropy: '',
  loggedIn: false,
  isAppLocked: true,
  isLocalAuthSet: false, // this value indicates where user went through local auth registration
}

const reducer = (state = initialState, action: Action<AccountActions, any>) => {
  switch (action.type) {
    case AccountActions.setDid:
      return { ...state, did: action.payload }
    case AccountActions.resetAccount:
      return initialState
    case AccountActions.setLogged:
      return { ...state, loggedIn: action.payload }
    case AccountActions.lockApp:
      return { ...state, isAppLocked: true }
    case AccountActions.unlockApp:
      return { ...state, isAppLocked: false }
    case AccountActions.setLocalAuth:
      return { ...state, isLocalAuthSet: true }
    case AccountActions.setEntropy:
      return { ...state, entropy: action.payload }
    case AccountActions.accountReset:
      return initialState
    default:
      return state
  }
}

export default reducer
