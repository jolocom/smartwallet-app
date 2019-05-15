import { navigationActions } from 'src/actions/'
import { AnyAction, Dispatch } from 'redux'
import { routeList } from 'src/routeList'
import { BackendMiddleware } from '../../backendMiddleware'
import SplashScreen from 'react-native-splash-screen'

export const showErrorScreen = (error: Error, returnTo = routeList.Home) => (
  dispatch: Dispatch<AnyAction>,
) =>
  dispatch(
    navigationActions.navigate({
      routeName: routeList.Exception,
      params: { returnTo, error },
    }),
  )

export const initApp = () => async (
  dispatch: Dispatch<AnyAction>,
  getState: Function,
  backendMiddleware: BackendMiddleware,
) => {
  try {
    await backendMiddleware.initStorage()
    SplashScreen.hide()
  } catch (e) {
    dispatch(showErrorScreen(e, routeList.Landing))
  }
}
