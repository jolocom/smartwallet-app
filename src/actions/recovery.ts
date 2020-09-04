import { ThunkAction } from '../store'
//import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { navigationActions } from './index'
import { routeList } from '../routeList'
import settingKeys from '../ui/settings/settingKeys'
import { removeNotification } from './notifications'

const getStoredSeedPhrase = async (backendMiddleware: any) => {
  return ''
}

export const showSeedPhrase = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  try {
    const mnemonic = await getStoredSeedPhrase(backendMiddleware)
    return dispatch(
      navigationActions.navigate({
        routeName: routeList.SeedPhrase,
        params: { mnemonic },
      }),
    )
  } catch (e) {
    console.error({ e })
  }
}

export const onRestoreAccess = (mnemonicInput: string[]): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const storedMnemonic = await getStoredSeedPhrase(backendMiddleware)
  if (storedMnemonic === mnemonicInput.join(' ')) {
    return dispatch(
      navigationActions.navigate({
        routeName: routeList.ChangePIN,
        params: { isPINrecovery: true },
      }),
    )
  }
  return dispatch(navigationActions.navigate({ routeName: routeList.Landing }))
}

export const setSeedPhraseSaved = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  await backendMiddleware.storageLib.store.setting(
    settingKeys.seedPhraseSaved,
    true,
  )

  // TODO: find sticky by id from queue, not active
  const {
    notifications: { active: stickyNotification },
  } = getState()
  if (stickyNotification) dispatch(removeNotification(stickyNotification))

  return dispatch({
    type: 'SET_SEED_PHRASE_SAVED',
  })
}
