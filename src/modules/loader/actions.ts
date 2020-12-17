import createAction from '~/utils/createAction'
import { LoaderActions, LoaderState } from './types'

export const dismissLoader = createAction(LoaderActions.dismiss)
export const setLoader = createAction<Pick<LoaderState, 'type' | 'msg'>>(
  LoaderActions.set,
)
