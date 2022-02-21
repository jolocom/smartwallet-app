import createAction from '~/utils/createAction'
import { AccountActionType, AccountActions, AccountAction } from './types'

// To avoid manually passing a generic type every time we call `createAction`
// redeclaring createAction fn with types specific to the `account` module
function createAccountAction<K extends keyof AccountActions>(type: K) {
  return createAction<AccountAction<K>>(type)
}

export const setDid = createAccountAction(AccountActionType.setDid)

export const setLogged = createAccountAction(AccountActionType.setLogged)

export const setLocalAuth = createAccountAction(AccountActionType.setLocalAuth)

export const resetAccount = createAccountAction(AccountActionType.resetAccount)

export const setTermsConsentVisibility = createAccountAction(
  AccountActionType.setTermsConsentVisibility,
)

export const setTermsConsentOutdatedness = createAccountAction(
  AccountActionType.setTermsConsentOutdatedness,
)
export const setAppLocked = createAccountAction(AccountActionType.setAppLocked)

export const setCurrentLanguage = createAccountAction(
  AccountActionType.setCurrentLanguage,
)

export const setAppDisabled = createAccountAction(
  AccountActionType.setAppDisabled,
)

export const setMnemonicWarningVisibility = createAccountAction(
  AccountActionType.setMnemonicWarningVisibility,
)

export const setMakingScreenshotDisability = createAccountAction(
  AccountActionType.setMakingScreenshotDisability,
)

// UI
export const setScreenHeight = createAccountAction(
  AccountActionType.setScreenHeight,
)
