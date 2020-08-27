import { ThunkAction } from '../store'
//import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { navigationActions } from './index'
import { routeList } from '../routeList'
import settingKeys from '../ui/settings/settingKeys'
import { removeNotification } from './notifications'
import { BackendMiddleware } from 'src/backendMiddleware'

const getStoredSeedPhrase = async (backendMiddleware: BackendMiddleware) => {
  const encryptedSeed = await backendMiddleware.storageLib.get.encryptedSeed()
  if (!encryptedSeed) {
    throw new Error('Can not retrieve Seed from database')
  }
  // TODO create vault from encrypted Seed
  const pass = await backendMiddleware.keyChainLib.getPassword()
  const vault = new SoftwareKeyProvider(Buffer.from(encryptedSeed, 'hex'))
  const mnemonic = vault.getMnemonic(pass)
  return mnemonic
}

export const showSeedPhrase = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  // FIXME TODO update after ready in native-core
  // NOTE: this below snipper has been extracted into getStoredSeedPhrase
  // because it is reused.

  //  const encryptedSeed = await backendMiddleware.storageLib.get.encryptedSeed()
  //  if (!encryptedSeed) {
  //    throw new Error('Can not retrieve Seed from database')
  //  }
  //  // TODO create vault from encrypted Seed
  //  const pass = await backendMiddleware.keyChainLib.getPassword()
  //  const vault = new SoftwareKeyProvider(Buffer.from(encryptedSeed, 'hex'))
  //  const mnemonic = vault.getMnemonic(pass)
  try {
    const mnemonic = await getStoredSeedPhrase(backendMiddleware)
    // return dispatch(
    //   navigationActions.navigate({
    //     routeName: routeList.SeedPhrase,
    //     params: { mnemonic },
    //   }),
    // )
    return dispatch(
      navigationActions.navigate({
        routeName: routeList.SeedPhrase,
        params: { mnemonic: ':(' },
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
  try {
    const storedMnemonic = await getStoredSeedPhrase(backendMiddleware)
    if (storedMnemonic === mnemonicInput.join(' ')) {
      return dispatch(
        navigationActions.navigate({
          routeName: routeList.ChangePIN,
          params: { isPINrecovery: true },
        }),
      )
    }
  } catch (err) {
    throw new Error('Cannot retrieve stored mnemonic')
  } finally {
    return dispatch(
      navigationActions.navigate({ routeName: routeList.Landing }),
    )
  }
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
