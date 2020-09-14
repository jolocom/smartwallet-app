import { Linking } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { AppError, ErrorCode } from '../../lib/errors'
import I18n from '../../locales/i18n'
import { routeList } from '../../routeList'
import { navigationActions, accountActions } from '../../actions'
import { ThunkAction } from '../../store'
import { withLoading, withErrorScreen } from '../modifiers'
import { showErrorScreen } from '.'

export const initApp: ThunkAction = async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  try {
    const storedSettings = await backendMiddleware.storageLib.get.settingsObject()

    // locale setup
    if (storedSettings.locale) I18n.locale = storedSettings.locale.selected
    else storedSettings.locale = I18n.locale

    storedSettings.locale = I18n.locale

    await dispatch(loadSettings(storedSettings))

    const ret = await dispatch(accountActions.checkIdentityExists)

    // FIXME what happens if no identity and this is a deeplink?
    // navigationActions.handleDeepLink throws NoWallet
    // need to improve this UX

    // FIXME: get rid of these after setting up deepLinking properly using
    // react-navigation
    const handleDeepLink = (url: string) =>
      dispatch(
        withLoading(withErrorScreen(navigationActions.handleDeepLink(url))),
      )
    Linking.addEventListener('url', event => handleDeepLink(event.url))
    await Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url)
    })

    throw new Error(
      'hfsdhfasdfhadjfhashdfasd akjdfhjashdfjkashdf ajsdhfasjdhfaksdhf ajhajdsfhasf',
    )
    return ret
  } catch (e) {
    return dispatch(
      showErrorScreen(
        new AppError(ErrorCode.WalletInitFailed, e, routeList.Landing),
      ),
    )
  } finally {
    SplashScreen.hide()
  }
}

const loadSettings = (settings: { [key: string]: any }) => ({
  type: 'LOAD_SETTINGS',
  value: settings,
})
