import { Locales } from '~/translations'
import createAction from '~/utils/createAction'
import { AccountActions } from './types'

export const setDid = createAction<AccountActions.setDid, string>(
  AccountActions.setDid,
)
export const setLogged = createAction<AccountActions.setLogged, boolean>(
  AccountActions.setLogged,
)
export const setLocalAuth = createAction<AccountActions.setLocalAuth, boolean>(
  AccountActions.setLocalAuth,
)
export const resetAccount = createAction(AccountActions.resetAccount)
export const setTermsConsentVisibility = createAction<
  AccountActions.setTermsConsentVisibility,
  boolean
>(AccountActions.setTermsConsentVisibility)
export const setTermsConsentOutdatedness = createAction<
  AccountActions.setTermsConsentOutdatedness,
  boolean
>(AccountActions.setTermsConsentOutdatedness)
export const setAppLocked = createAction<AccountActions.setAppLocked, boolean>(
  AccountActions.setAppLocked,
)

export const setCurrentLanguage = createAction<
  AccountActions.setCurrentLanguage,
  Locales
>(AccountActions.setCurrentLanguage)

export const setAppDisabled = createAction<
  AccountActions.setAppDisabled,
  boolean
>(AccountActions.setAppDisabled)

export const setMnemonicWarningVisibility = createAction<
  AccountActions.setMnemonicWarningVisibility,
  boolean
>(AccountActions.setMnemonicWarningVisibility)

export const setMakingScreenshotDisability = createAction<
  AccountActions.setMakingScreenshotDisability,
  boolean
>(AccountActions.setMakingScreenshotDisability)
// UI
export const setScreenHeight = createAction<
  AccountActions.setScreenHeight,
  number
>(AccountActions.setScreenHeight)
