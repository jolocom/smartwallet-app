import { navigationActions } from 'src/actions/'
import { Dispatch, AnyAction } from 'redux'
import { routeList } from 'src/routeList'

export const showErrorScreen = (error: Error, returnTo = routeList.Home) => (
  dispatch: Dispatch<AnyAction>,
) =>
  dispatch(
    navigationActions.navigate({
      routeName: routeList.Exception,
      params: { returnTo, error },
    }),
  )
