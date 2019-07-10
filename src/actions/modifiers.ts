import { ActionCreator } from 'redux'
import { AnyAction, ThunkAction } from 'src/store'
import { AppError } from '../lib/errors'

/**
 * Wraps a thunk action with two actions created with loadingAction action creator which are dispatched before and after,
 * regardless of errors
 * @param loadingAction - An action creator to create the actions to be dispatched before and after the wrappedAction-
 * @param wrappedAction - The thunkAction to be wrapped
 */
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

/**
 * Wraps a thunk action with an error handler to be dispatched on thrown error
 * @param errorHandler - An action creator to be dispatched with the error if an error is thrown
 * @param errorModifier - An optional modifier for the error which is thrown, is Identity function by default
 * @param wrappedAction - The thunkaction to be wrapped. If dispatching it throws an error, the errorhandler will be dispatched
 */
export const withErrorHandling = (
  errorHandler: ActionCreator<AnyAction>,
  errorModifier: (error: AppError) => AppError = (error: AppError) => error,
) => (wrappedAction: ThunkAction): ThunkAction => async dispatch => {
  try {
    return await dispatch(wrappedAction)
  } catch (error) {
    return dispatch(errorHandler(errorModifier(error)))
  }
}
