import createAction from '~/utils/createAction'
import { LoaderActions } from './types'

export const dismissLoader = createAction(LoaderActions.dismiss)
export const setLoader = createAction(LoaderActions.set)
