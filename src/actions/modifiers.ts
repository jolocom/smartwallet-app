import { ActionCreator, AnyAction } from 'redux'
import { ThunkAction } from 'src/store'
import { AppError } from '@jolocom/sdk/js/src/lib/errors'
import { toggleLoading } from './account'
import { showErrorScreen } from './generic'

/**
 * Curried function that wraps a {@link ThunkAction} with two calls to the provided loadingAction
 * {@link ActionCreator} (called with "true" before the wrapped action is dispatched, and with "false" after)
 * @param loadingAction - An action creator to create the actions to be dispatched before and after the wrappedAction-
 * @param wrappedAction - The thunkAction to be wrapped
 * @example dispatch(withLoading(toggleLoading)(saveClaims))
 */
export const withLoadingHandler = (loadingAction: ActionCreator<AnyAction>) => (
  wrappedAction: ThunkAction,
): ThunkAction => async dispatch => {
  try {
    dispatch(loadingAction(true))
    return await dispatch(wrappedAction)
  } finally {
    // NOTE: timeout is a hack to avoid flashing when navigating, as the new
    // screen will have not been loaded yet but the AppLoading will be taken
    // down, which will flash the old screen shortly
    setTimeout(() => dispatch(loadingAction(false)), 100)
  }
}

type ErrorModifier = (error: AppError | Error) => AppError

/**
 * Curried function that wraps a {@link ThunkAction} with the provided error handler to be dispatched on thrown error
 * @param errorHandler - An {@link ActionCreator} to be dispatched with the error if an error is thrown
 * @param errorModifier - An optional modifier for the error which is thrown, is Identity function by default
 * @param wrappedAction - The {@link ThunkAction} to be wrapped. If dispatching it throws an error, the errorhandler will be dispatched
 * @example dispatch(withErrorHandling(showErrorScreen)(saveClaims))
 * @dev The return value from this modifier can be passed to other modifiers, i.e. modifiers can be composed
 * e.g. dispatch(withLoading(toggleLoading)(withErrorHandling(showErrorScreen)(saveClaims)))
 */
export const withErrorHandler = (
  errorHandler: ActionCreator<ThunkAction>,
  errorModifier: ErrorModifier | undefined = undefined,
) => (
  wrappedAction: ThunkAction,
  modifier: ErrorModifier | undefined = undefined,
): ThunkAction => async dispatch => {
  modifier = modifier || errorModifier
  try {
    return await dispatch(wrappedAction)
  } catch (error) {
    if (modifier) error = modifier(error)
    return dispatch(errorHandler(error))
  }
}

export const withLoading = withLoadingHandler(toggleLoading)
export const withErrorScreen = withErrorHandler(showErrorScreen)
