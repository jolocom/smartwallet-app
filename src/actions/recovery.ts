import { ThunkAction } from '../store'
//import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { navigationActions, genericActions } from './index'
import { routeList } from '../routeList'
import settingKeys from '../ui/settings/settingKeys'
import { removeNotification } from './notifications'
import { entropyToMnemonic, mnemonicToEntropy } from 'bip39'
import useResetKeychainValues from 'src/ui/deviceauth/hooks/useResetKeychainValues'
import { PIN_SERVICE } from 'src/ui/deviceauth/utils/keychainConsts'
import { checkLocalDeviceAuthSet } from './account'
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
  sdk,
) => {
  let recovered = false

  const recoveredEntropy = Buffer.from(
    mnemonicToEntropy(mnemonicInput.join(' ')),
    'hex'
  )

  try {
    const didMethod = await sdk.didMethods.getDefault()
    if (didMethod.recoverFromSeed) {
      const { identityWallet } = await didMethod.recoverFromSeed(
        recoveredEntropy,
        await sdk.keyChainLib.getPassword()
      )
      recovered = identityWallet.did === sdk.idw.did
    }
  } catch(e) {
    console.error('onRestoreAccess failed', e)
  }

  if (recovered) {
    const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)
    await resetServiceValuesInKeychain()
    await dispatch(genericActions.setLocked(false))
  }

  await dispatch(checkLocalDeviceAuthSet)
  return dispatch(navigationActions.navigatorResetHome())
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
