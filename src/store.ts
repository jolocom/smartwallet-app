import { createStore, applyMiddleware, AnyAction, Store } from 'redux'

import thunk, {
  ThunkDispatch as OriginalThunkDispatch,
  ThunkAction as OriginalThunkAction,
} from 'redux-thunk'
import { RootState, rootReducer } from 'src/reducers'
import config from 'src/config'

import { BackendMiddleware } from './backendMiddleware'

export function initStore() {
  const backendMiddleware = new BackendMiddleware(config)

  return createStore(
    rootReducer,
    {},
    applyMiddleware(thunk.withExtraArgument(backendMiddleware)),
  ) as StoreWithThunkDispatch
}

interface StoreWithThunkDispatch extends Store<RootState> {
  dispatch: ThunkDispatch
}

export type AnyAction = AnyAction
export type ThunkDispatch = OriginalThunkDispatch<
  RootState,
  BackendMiddleware,
  AnyAction
>
export type ThunkAction<
  R = AnyAction | Promise<AnyAction | void>
> = OriginalThunkAction<R, RootState, BackendMiddleware, AnyAction>
