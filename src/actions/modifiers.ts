import { ActionCreator, AnyAction } from 'redux'
import { ThunkDispatch } from '../store'
import { ThunkAction as OriginalThunkAction } from 'redux-thunk'
import { AppError } from '../lib/errors'
import { RootState } from '../reducers'
import { BackendMiddleware } from '../backendMiddleware'
import { NavigationAction } from 'react-navigation'

type ThunkAction<R> = OriginalThunkAction<
  R,
  RootState,
  BackendMiddleware,
  AnyAction
>

export const withLoading = <R extends AnyAction>(
  loadingAction: ActionCreator<R>,
) => <S>(wrappedAction: ThunkAction<S>) => {
  return async function(dispatch: ThunkDispatch) {
    try {
      dispatch(loadingAction(true))
      return await dispatch(wrappedAction)
    } finally {
      dispatch(loadingAction(false))
    }
  }
}

export const withErrorHandling = <E extends AnyAction | NavigationAction>(
  errorHandler: ActionCreator<E>,
  errorModifier: (error: AppError) => AppError = (error: AppError) => error,
) => <S>(wrappedAction: ThunkAction<S>)  => {
  return async function(dispatch: ThunkDispatch): Promise<S | E> {
    try {
      return await dispatch(wrappedAction)
    } catch (error) {
      return dispatch(errorHandler(errorModifier(error)))
    }
  }
}
