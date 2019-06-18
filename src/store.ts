import {
  createStore,
  applyMiddleware,
  AnyAction as OriginalAnyAction,
} from 'redux'
import { NavigationAction } from 'react-navigation'
import thunk, {
  ThunkDispatch as OriginalThunkDispatch,
  ThunkAction as OriginalThunkAction,
} from 'redux-thunk'
import { RootState, rootReducer } from 'src/reducers'
import { BackendMiddleware } from 'src/backendMiddleware'
import config from 'src/config'
import { Store } from 'react-redux'

import {
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

export function initStore(): Store<any> {
  const backendMiddleware = new BackendMiddleware(config)

  const navMiddleware = createReactNavigationReduxMiddleware(
    (state: RootState) => state.navigation,
  );

  return createStore(
    rootReducer,
    {},
    applyMiddleware(thunk.withExtraArgument(backendMiddleware), navMiddleware),
  )
}

export type AnyAction = OriginalAnyAction | NavigationAction
export type ThunkDispatch = OriginalThunkDispatch<
  RootState,
  BackendMiddleware,
  AnyAction
>
export type ThunkAction<
  R = AnyAction | Promise<AnyAction | void>
> = OriginalThunkAction<R, RootState, BackendMiddleware, AnyAction>
export type ThunkActionCreator<R = AnyAction | Promise<AnyAction | void>> = (
  ...any: any[]
) => ThunkAction<R>
