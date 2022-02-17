import { AccountState, AccountActions } from './types'
import { Locales } from '~/translations'
import {
  setDid,
  setLogged,
  setLocalAuth,
  resetAccount,
  setTermsConsentVisibility,
  setTermsConsentOutdatedness,
  setCurrentLanguage,
  setAppDisabled,
  setMnemonicWarningVisibility,
  setMakingScreenshotDisability,
} from './actions'

const initialState: AccountState = {
  did: '',
  loggedIn: false,
  isLocalAuthSet: false, // this value indicates where user went through local auth registration
  isAppLocked: true,
  screenHeight: 0,
  currentLanguage: Locales.en,
  isAppDisabled: false,
  isMnemonicWarningVisible: undefined,
  termsConsent: {
    isVisible: false,
    isOutdated: false,
  },
  isMakingScreenshotDisabled: true,
}

const reducer = (
  state = initialState,
  action: ReturnType<
    | typeof setDid
    | typeof setLogged
    | typeof setLocalAuth
    | typeof resetAccount
    | typeof setTermsConsentVisibility
    | typeof setTermsConsentOutdatedness
    | typeof setCurrentLanguage
    | typeof setAppDisabled
    | typeof setMnemonicWarningVisibility
    | typeof setMakingScreenshotDisability
  >,
) => {
  switch (action.type) {
    case AccountActions.setDid:
      return { ...state, did: action.payload }
    case AccountActions.setLogged:
      return { ...state, loggedIn: action.payload }
    case AccountActions.setLocalAuth:
      return { ...state, isLocalAuthSet: action.payload }
    case AccountActions.resetAccount:
      return initialState
    case AccountActions.setTermsConsentVisibility: {
      const { termsConsent } = state
      if (action.payload === true) {
        return {
          ...state,
          termsConsent: { ...termsConsent, isVisible: action.payload },
        }
      } else {
        return {
          ...state,
          termsConsent: {
            isVisible: false,
            isOutdated: false,
          },
        }
      }
    }
    case AccountActions.setTermsConsentOutdatedness: {
      const { termsConsent } = state
      return {
        ...state,
        termsConsent: { ...termsConsent, isOutdated: action.payload },
      }
    }
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
    case AccountActions.setMakingScreenshotDisability:
      return {
        ...state,
        isMakingScreenshotDisabled: action.payload,
      }
    default:
      return state
  }
}

export default reducer
