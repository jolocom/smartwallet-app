import { AccountState, AccountActions } from './types'
import { Action } from '~/types/actions'
import { Locales } from '~/translations'

const initialState: AccountState = {
  did: '',
  loggedIn: false,
  isLocalAuthSet: false, // this value indicates where user went through local auth registration
  showTermsConsent: false,
  isAppLocked: true,
  screenHeight: 0,
  currentLanguage: Locales.en,
  isAppDisabled: false,
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
    case AccountActions.setCurrentLanguage:
      return { ...state, currentLanguage: action.payload }
    case AccountActions.setAppDisabled:
      return { ...state, isAppDisabled: action.payload }

    default:
      return state
  }
}

export default reducer
