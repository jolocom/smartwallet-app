import { ActionCreator } from 'redux'
import { ThunkAction } from 'src/store'
import { AppError } from '../lib/errors'
import { toggleLoading } from './account'

/**
 * Action modifier that wraps a {@link ThunkAction} with calls to {@link toggleLoading},
 * to show the AppLoading spinner while the action is being executed
 * @param wrappedAction - The thunkAction to be wrapped
 * @example dispatch(withLoading(saveClaims))
 */
export const withLoading = (
  wrappedAction: ThunkAction,
): ThunkAction => async dispatch => {
  try {
    dispatch(toggleLoading(true))
    return await dispatch(wrappedAction)
  } finally {
    // NOTE: timeout is a hack to avoid flashing when navigating, as the new
    // screen will have not been loaded yet but the AppLoading will be taken
    // down, which will flash the old screen shortly
    setTimeout(() => dispatch(toggleLoading(false)), 100)
  }
}

/**
 * Curried function that wraps a {@link ThunkAction} with the provided error handler to be dispatched on thrown error
 * @param errorHandler - An {@link ActionCreator} to be dispatched with the error if an error is thrown
 * @param errorModifier - An optional modifier for the error which is thrown, is Identity function by default
 * @param wrappedAction - The {@link ThunkAction} to be wrapped. If dispatching it throws an error, the errorhandler will be dispatched
 * @example dispatch(withErrorHandling(showErrorScreen)(saveClaims))
 * @dev The return value from this modifier can be passed to other modifiers, i.e. modifiers can be composed
 * e.g. dispatch(withLoading(toggleLoading)(withErrorHandling(showErrorScreen)(saveClaims)))
 */
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
