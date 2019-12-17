import { ThunkAction } from '../store'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { navigationActions } from './index'
import { routeList } from '../routeList'
import settingKeys from '../ui/settings/settingKeys'
import { SETTINGS } from '../reducers/settings'
import Share from 'react-native-share'
import { toBase64 } from '../lib/util'

export const showSeedPhrase = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const encryptedSeed = await backendMiddleware.storageLib.get.encryptedSeed()
  if (!encryptedSeed) {
    throw new Error('Can not retrieve Seed from database')
  }
  // TODO create vault from encrypted Seed
  const pass = await backendMiddleware.keyChainLib.getPassword()
  const vault = new SoftwareKeyProvider(Buffer.from(encryptedSeed, 'hex'))
  const mnemonic = vault.getMnemonic(pass)
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.SeedPhrase,
      params: { mnemonic },
    }),
  )
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
  return dispatch({
    type: SETTINGS.SET_SEED_PHRASE_SAVED,
  })
}

export const setAutoBackup = (isEnabled: boolean): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  if (isEnabled) await dispatch(autoBackupData(isEnabled))
  await backendMiddleware.storageLib.store.setting(
    settingKeys.autoBackup,
    isEnabled,
  )
  return dispatch({
    type: SETTINGS.SET_AUTO_BACKUP,
    value: isEnabled,
  })
}

export const setLastBackup = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const currDate = new Date().toISOString()
  await backendMiddleware.storageLib.store.setting(
    settingKeys.lastBackup,
    currDate,
  )
  return dispatch({
    type: SETTINGS.SET_AUTO_BACKUP,
    value: currDate,
  })
}

export const disableAndRemoveBackup = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  dispatch(setAutoBackup(false))
  await backendMiddleware.deleteBackup()
}

export const manualBackup = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const encryptedBackup = await backendMiddleware.backupData(false)
  await Share.open({
    filename: 'jolocom-backup',
    url: `data:text/plain;base64,${toBase64(JSON.stringify(encryptedBackup))}`,
  })
  // in case something throws (e.g. upload fails, user dismissed) this code will not be reached
  dispatch(setLastBackup())
}

export const autoBackupData = (isEnabled?: boolean): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  if (getState().settings.autoBackup || isEnabled)
    await backendMiddleware.backupData(true)
  dispatch(setLastBackup())
}
