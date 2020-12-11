import createAction from '~/utils/createAction'
import { AccountActions } from './types'

export const setDid = createAction<string>(AccountActions.setDid)
export const setLogged = createAction<boolean>(AccountActions.setLogged)
export const setLocalAuth = createAction<boolean>(AccountActions.setLocalAuth)
export const accountReset = createAction(AccountActions.accountReset)
export const showTermsConsent = createAction<boolean>(
  AccountActions.showTermsConsent,
)
export const setAppLocked = createAction<boolean>(AccountActions.setAppLocked)
