import createAction from '~/utils/createAction'
import { AccountActionTypes } from './types'

export const setDid = createAction(AccountActionTypes.setDid)
export const setLogged = createAction(AccountActionTypes.setLogged)
export const resetAccount = createAction(AccountActionTypes.resetAccount)
