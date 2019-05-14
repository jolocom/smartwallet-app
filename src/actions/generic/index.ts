import { navigationActions } from 'src/actions/'
import { AnyAction, Dispatch } from 'redux'
import { routeList } from 'src/routeList'
import { BackendMiddleware } from '../../backendMiddleware'
import SplashScreen from 'react-native-splash-screen'
import I18n from 'src/locales/i18n'

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
    const storedSettings = await backendMiddleware.storageLib.get.settingsObject()

    // locale setup
    if (storedSettings.locale) I18n.locale = storedSettings.locale
    else storedSettings.locale = I18n.locale

    dispatch(loadSettings(storedSettings))
    SplashScreen.hide()
  } catch (e) {
    dispatch(showErrorScreen(e, routeList.Landing))
  }
}

export const loadSettings = (settings: {[key: string]: any}) => ({
  type: 'LOAD_SETTINGS',
  value: settings,
})

export const setLocale = (locale: string) => async (
  dispatch: Dispatch<AnyAction>,
  getState: Function,
  backendMiddleware: BackendMiddleware,
) => {
  await backendMiddleware.storageLib.store.setting('locale', locale)
  I18n.locale = locale
  dispatch({
    type: 'SET_LOCALE',
    value: locale,
  })
}
