import { ActionCreator } from 'redux'
import { AnyAction, ThunkAction } from 'src/store'
import { AppError } from '../lib/errors'

export const withLoading = (loadingAction: ActionCreator<AnyAction>) => (
  wrappedAction: ThunkAction,
): ThunkAction => async dispatch => {
  try {
    dispatch(loadingAction(true))
    return await dispatch(wrappedAction)
  } finally {
    dispatch(loadingAction(false))
  }
}

export const withErrorHandling = (
  errorHandler: ActionCreator<ThunkAction>,
  errorModifier: (error: AppError) => AppError = (error: AppError) => error,
) => (wrappedAction: ThunkAction): ThunkAction => async dispatch => {
  try {
    return await dispatch(wrappedAction)
  } catch (error) {
    return dispatch(errorHandler(errorModifier(error)))
  }
}
