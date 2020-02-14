import { createStore, applyMiddleware, AnyAction } from 'redux'

import thunk, {
  ThunkDispatch as OriginalThunkDispatch,
  ThunkAction as OriginalThunkAction,
} from 'redux-thunk'
import { RootState, rootReducer } from 'src/reducers'
import config from 'src/config'

import { BackendMiddleware } from './backendMiddleware'

export const backendMiddleware = new BackendMiddleware(config)

export function initStore() {

  /*
   * The {} as RootState type assertion:
   * The second argument, "preloadedState" is mandatory, and typed as RootState.
   * We provide an empty object. The store will have the correct default state
   * after all reducers initialise.
   */

  return createStore(
    rootReducer,
    {} as RootState,
    applyMiddleware(thunk.withExtraArgument(backendMiddleware)),
  )
}

export type ThunkDispatch = OriginalThunkDispatch<
  RootState,
  BackendMiddleware,
  AnyAction
>
export type ThunkAction<
  R = AnyAction | Promise<AnyAction | void>
> = OriginalThunkAction<R, RootState, BackendMiddleware, AnyAction>
