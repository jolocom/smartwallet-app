import { AccountState, AccountActions } from './types'
import { Action } from '~/types/actions'

const initialState: AccountState = {
  did: '',
  loggedIn: false,
  isLocalAuthSet: false, // this value indicates where user went through local auth registration
  showTermsConsent: false,
  isAppLocked: true,
  screenHeight: 0,
}

const reducer = (
  state = initialState,
  action: Action<AccountActions, any>,
): AccountState => {
  switch (action.type) {
    case AccountActions.setDid:
      return { ...state, did: action.payload }
    case AccountActions.setLogged:
      return { ...state, loggedIn: action.payload }
    case AccountActions.setLocalAuth:
      return { ...state, isLocalAuthSet: action.payload }
    case AccountActions.resetAccount:
      return initialState
    case AccountActions.showTermsConsent:
      return { ...state, showTermsConsent: action.payload }
    case AccountActions.setAppLocked:
      return { ...state, isAppLocked: action.payload }
    case AccountActions.setScreenHeight:
      return { ...state, screenHeight: action.payload }
    default:
      return state
  }
}

export default reducer
