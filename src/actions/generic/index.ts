import { navigationActions } from 'src/actions/'
import { Dispatch, AnyAction } from 'redux'

export const showErrorScreen = (error: Error) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(navigationActions.navigate({
      routeName: 'Exception',
      params: {
        errorMessage: error.message,
        stackTrace: error.stack
      }
    }))
  }
}
