import createAction from '~/utils/createAction'
import { AccountActionTypes } from './types'

export const setDid = createAction(AccountActionTypes.setDid)
export const setLogged = createAction(AccountActionTypes.setLogged)
export const resetAccount = createAction(AccountActionTypes.resetAccount)
export const lockApp = createAction(AccountActionTypes.lockApp)
export const unlockApp = createAction(AccountActionTypes.unlockApp)
export const setLocalAuth = createAction(AccountActionTypes.setLocalAuth)
export const setEntropy = createAction(AccountActionTypes.setEntropy)
