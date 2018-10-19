import { navigationActions } from 'src/actions/'
import { Dispatch, AnyAction } from 'redux'
import { routeList } from 'src/routeList'

export const showErrorScreen = (error: Error) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(navigationActions.navigate({
      routeName: routeList.Exception
      // params: {
      //   errorMessage: error.message,
      //   stackTrace: error.stack
      // }
    }))
  }
}

export const toggleLoadingScreen = (loading: boolean) => {
  return{
    type: 'SET_LOADING',
    value: loading
  }
}