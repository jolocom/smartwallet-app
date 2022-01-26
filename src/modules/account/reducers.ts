import { AccountState, AccountActions } from './types'
import { Action } from '~/types/actions'
import { Locales } from '~/translations'

const initialState: AccountState = {
  did: '',
  loggedIn: false,
  isLocalAuthSet: false, // this value indicates where user went through local auth registration
  isTermsConsentVisible: false,
  isTermsConsentOutdated: false,
  isAppLocked: true,
  screenHeight: 0,
  currentLanguage: Locales.en,
  isAppDisabled: false,
  isMnemonicWarningVisible: undefined,
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
    case AccountActions.setTermsConsentVisibility:
      if (action.payload === true) {
        return { ...state, isTermsConsentVisible: action.payload }
      } else {
        return {
          ...state,
          isTermsConsentVisible: action.payload,
          isTermsConsentOutdated: false,
        }
      }
    case AccountActions.setTermsConsentOutdatedness:
      return { ...state, isTermsConsentOutdated: action.payload }
    case AccountActions.setAppLocked:
      return { ...state, isAppLocked: action.payload }
    case AccountActions.setScreenHeight:
      return { ...state, screenHeight: action.payload }
    case AccountActions.setCurrentLanguage:
      return { ...state, currentLanguage: action.payload }
    case AccountActions.setAppDisabled:
      return { ...state, isAppDisabled: action.payload }
    case AccountActions.setMnemonicWarningVisibility:
      return {
        ...state,
        isMnemonicWarningVisible: action.payload,
      }
    default:
      return state
  }
}

export default reducer
