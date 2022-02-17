import createAction from '~/utils/createAction'
import { LoaderActions, LoaderState } from './types'

export const dismissLoader = createAction<LoaderActions.dismiss, undefined>(
  LoaderActions.dismiss,
)
export const setLoader = createAction<
  LoaderActions.set,
  Pick<LoaderState, 'type' | 'msg'>
>(LoaderActions.set)
