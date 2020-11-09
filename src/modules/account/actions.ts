import createAction from '~/utils/createAction'
import { AccountActions } from './types'

export const setDid = createAction(AccountActions.setDid)
export const setLogged = createAction(AccountActions.setLogged)
export const resetAccount = createAction(AccountActions.resetAccount)
export const setLocalAuth = createAction(AccountActions.setLocalAuth)
export const accountReset = createAction(AccountActions.accountReset)
export const showTermsConsent = createAction(AccountActions.showTermsConsent)
export const setAppLocked = createAction(AccountActions.setAppLocked)
