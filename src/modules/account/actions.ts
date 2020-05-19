import createAction from '~/utils/createAction'
import { AccountActionTypes } from './types'

export const setDid = createAction(AccountActionTypes.setDid)
export const resetAccount = createAction(AccountActionTypes.resetAccount)
