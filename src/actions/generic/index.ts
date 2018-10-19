import { navigationActions } from 'src/actions/'
import { Dispatch, AnyAction } from 'redux'
import { routeList } from 'src/routeList'

// TODO: optimize logic
export const showErrorScreen = (error: Error, flag?: string) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(navigationActions.navigate({
      routeName: routeList.Exception,
      params: {
        flag: flag || 'default'
      }
    }))
  }
}

export const toggleLoadingScreen = (loading: boolean) => {
  return{
    type: 'SET_LOADING',
    value: loading
  }
}