import createAction from '~/utils/createAction'
import { AccountActions } from './types'

export const setDid = createAction(AccountActions.setDid)
export const setLogged = createAction(AccountActions.setLogged)
export const resetAccount = createAction(AccountActions.resetAccount)
export const lockApp = createAction(AccountActions.lockApp)
export const unlockApp = createAction(AccountActions.unlockApp)
export const setLocalAuth = createAction(AccountActions.setLocalAuth)
export const setEntropy = createAction(AccountActions.setEntropy)
export const accountReset = createAction(AccountActions.accountReset)
