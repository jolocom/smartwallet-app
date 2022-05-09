import { Locales } from '~/translations'
import { AccountState, AccountActionType } from './types'
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
  setScreenHeight,
  setAppLocked,
  setIsBranchSubscribed,
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
  setIsBranchSubscribed: false,
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
    | typeof setScreenHeight
    | typeof setAppLocked
    | typeof setIsBranchSubscribed
  >,
) => {
  switch (action.type) {
    case AccountActionType.setDid:
      return { ...state, did: action.payload }
    case AccountActionType.setLogged:
      return { ...state, loggedIn: action.payload }
    case AccountActionType.setLocalAuth:
      return { ...state, isLocalAuthSet: action.payload }
    case AccountActionType.resetAccount:
      return initialState
    case AccountActionType.setTermsConsentVisibility: {
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
    case AccountActionType.setTermsConsentOutdatedness: {
      const { termsConsent } = state
      return {
        ...state,
        termsConsent: { ...termsConsent, isOutdated: action.payload },
      }
    }
    case AccountActionType.setAppLocked:
      return { ...state, isAppLocked: action.payload }
    case AccountActionType.setScreenHeight:
      return { ...state, screenHeight: action.payload }
    case AccountActionType.setCurrentLanguage:
      return { ...state, currentLanguage: action.payload }
    case AccountActionType.setAppDisabled:
      return { ...state, isAppDisabled: action.payload }
    case AccountActionType.setMnemonicWarningVisibility:
      return {
        ...state,
        isMnemonicWarningVisible: action.payload,
      }
    case AccountActionType.setMakingScreenshotDisability:
      return {
        ...state,
        isMakingScreenshotDisabled: action.payload,
      }
    case AccountActionType.setIsBranchSubscribed: {
      return {
        ...state,
        isBranchSubscribed: action.payload,
      }
    }
    default:
      return state
  }
}

export default reducer
