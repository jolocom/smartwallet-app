import { navigationActions } from 'src/actions/'
import { routeList } from 'src/routeList'
import SplashScreen from 'react-native-splash-screen'
import I18n from 'src/locales/i18n'
import { ThunkAction } from 'src/store'
import { AppError, ErrorCode } from '@jolocom/sdk/js/src/lib/errors'
import settingKeys from '../../ui/settings/settingKeys'
import { AsyncStorage } from 'react-native'
import crypto from 'crypto'
import { termsOfServiceDE } from 'src/ui/termsofservice/legalTexts'

export const showErrorScreen = (
  error: AppError | Error,
): ThunkAction => dispatch => {
  const appError: AppError =
    error.constructor === AppError
      ? (error as AppError)
      : new AppError(ErrorCode.Unknown, error)

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.Exception,
      params: {
        returnTo: appError.navigateTo,
        error: appError,
      },
    }),
  )
}

export const initApp: ThunkAction = async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  try {
    const storedSettings = await backendMiddleware.storageLib.get.settingsObject()

    /**
     * @dev Until German and Dutch terms are polished, only English is used.
     * previous code:
     * if (storedSettings.locale) I18n.locale = storedSettings.locale
     * else storedSettings.locale = I18n.locale
     */
    storedSettings.locale = I18n.locale

    SplashScreen.hide()
    return dispatch(loadSettings(storedSettings))
  } catch (e) {
    return dispatch(
      showErrorScreen(
        new AppError(ErrorCode.WalletInitFailed, e, routeList.Landing),
      ),
    )
  }
}

const hashString = (text: string) => {
  return crypto
    .createHash('sha256')
    .update(text)
    .digest('hex')
}

export const checkTermsOfService = (
  route: routeList,
): ThunkAction => async dispatch => {
  const storageHash = await AsyncStorage.getItem('termsOfConditions')
  const currentHash = hashString(termsOfServiceDE)
  const shouldShowTerms = storageHash !== currentHash

  return dispatch(
    navigationActions.navigate({
      routeName: shouldShowTerms ? routeList.TermsOfServiceConsent : route,
      params: { nextRoute: route },
    }),
  )
}

export const storeTermsOfService = (
  route: routeList,
): ThunkAction => async dispatch => {
  const termsHash = hashString(termsOfServiceDE)
  await AsyncStorage.setItem('termsOfConditions', termsHash)

  dispatch(navigationActions.navigate({ routeName: route }))
}

export const loadSettings = (settings: { [key: string]: any }) => ({
  type: 'LOAD_SETTINGS',
  value: settings,
})

export const setLocale = (locale: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  await backendMiddleware.storageLib.store.setting(settingKeys.locale, locale)
  I18n.locale = locale
  dispatch({ type: 'SET_LOCALE', value: locale })

  // we need to reset the navigator so that all screens are re-rendered with the
  // new locale
  return dispatch(navigationActions.navigatorReset())
}
