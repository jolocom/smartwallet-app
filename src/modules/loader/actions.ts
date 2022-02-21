import createAction from '~/utils/createAction'
import { LoaderAction, LoaderActions, LoaderActionType } from './types'

// To avoid manually passing a generic type every time we call `createAction`
// redeclaring createAction fn with types specific to the `loader` module
function createLoaderAction<K extends keyof LoaderActions>(type: K) {
  return createAction<LoaderAction<K>>(type)
}

export const dismissLoader = createLoaderAction(LoaderActionType.dismiss)

export const setLoader = createLoaderAction(LoaderActionType.set)
