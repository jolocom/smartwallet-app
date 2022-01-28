import { Locales } from '~/translations'
import createAction from '~/utils/createAction'
import { AccountActions } from './types'

export const setDid = createAction<string>(AccountActions.setDid)
export const setLogged = createAction<boolean>(AccountActions.setLogged)
export const setLocalAuth = createAction<boolean>(AccountActions.setLocalAuth)
export const resetAccount = createAction(AccountActions.resetAccount)
export const showTermsConsent = createAction<boolean>(
  AccountActions.showTermsConsent,
)
export const setAppLocked = createAction<boolean>(AccountActions.setAppLocked)

export const setCurrentLanguage = createAction<Locales>(
  AccountActions.setCurrentLanguage,
)

export const setAppDisabled = createAction<boolean>(
  AccountActions.setAppDisabled,
)

export const setMnemonicWarningVisibility = createAction<boolean>(
  AccountActions.setMnemonicWarningVisibility,
)
// UI
export const setScreenHeight = createAction<number>(
  AccountActions.setScreenHeight,
)
