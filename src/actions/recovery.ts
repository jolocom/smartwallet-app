import { ThunkAction } from '../store'
//import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { navigationActions, accountActions } from './index'
import { routeList } from '../routeList'
import settingKeys from '../ui/settings/settingKeys'
import { removeNotification } from './notifications'
import { entropyToMnemonic, mnemonicToEntropy } from 'bip39'
 // TODO Import ^ from jolocom-lib

export const showSeedPhrase = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const encryptedSeed = await backendMiddleware.storageLib
    .get.setting('encryptedSeed')

  if (!encryptedSeed) {
    throw new Error('Can not retrieve Seed from database')
  }

  const decrypted = await backendMiddleware.idw.asymDecrypt(
    Buffer.from(encryptedSeed.b64Encoded, 'base64'),
    await backendMiddleware.keyChainLib.getPassword()
  )

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.SeedPhrase,
      params: { mnemonic: entropyToMnemonic(decrypted)},
    }),
  )
}

/**
 * called during PIN code restoration
 */
export const onRestoreAccess = (mnemonicInput: string[]): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  let recovered = false

  const recoveredEntropy = Buffer.from(
    mnemonicToEntropy(mnemonicInput.join(' ')),
    'hex'
  )

  try {
    const didMethod = await backendMiddleware.didMethods.getDefault()
    if (didMethod.recoverFromSeed) {
      const { identityWallet } = await didMethod.recoverFromSeed(
        recoveredEntropy,
        await backendMiddleware.keyChainLib.getPassword()
      )
      recovered = identityWallet.did === backendMiddleware.idw.did
    }
  } catch(e) {
    console.error('onRestoreAccess failed', e)
  }

  if (recovered) {
    await dispatch(accountActions.openLock())
    return dispatch(navigationActions.navigate({
      routeName: routeList.ChangePIN,
      params: { isPINrecovery: true },
    }))
  }

  return dispatch(navigationActions.navigateBackHome())
}

export const setSeedPhraseSaved = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  // No delete call available yet, overwriting with empty object
  await backendMiddleware.storageLib.store.setting('encryptedSeed', {})
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
