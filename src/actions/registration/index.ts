import { navigationActions } from 'src/actions/'
import { routeList } from 'src/routeList'
import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { ThunkAction } from 'src/store'
import { navigatorResetHome } from '../navigation'
import { backupData, setSeedPhraseSaved } from '../recovery'
import { BackupData } from '../../lib/backup'
import { withLoading } from '../modifiers'

export const setLoadingMsg = (loadingMsg: string) => ({
  type: 'SET_LOADING_MSG',
  value: loadingMsg,
})

export const setIsRegistering = (value: boolean) => ({
  type: 'SET_IS_REGISTERING',
  value,
})

export const createIdentity = (encodedEntropy: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  dispatch(
    navigationActions.navigate({
      routeName: routeList.RegistrationProgress,
    }),
  )

  const isRegistering = getState().registration.loading.isRegistering
  if (isRegistering) return

  dispatch(setIsRegistering(true))

  dispatch(setLoadingMsg(loading.loadingStages[0]))
  await backendMiddleware.createKeyProvider(encodedEntropy)

  dispatch(setLoadingMsg(loading.loadingStages[1]))
  await backendMiddleware.fuelKeyWithEther()

  dispatch(setLoadingMsg(loading.loadingStages[2]))
  const identity = await backendMiddleware.createIdentity()

  dispatch(setDid(identity.did))
  dispatch(setLoadingMsg(loading.loadingStages[3]))
  dispatch(setIsRegistering(false))

  return dispatch(navigatorResetHome())
}

export const recoverSeed = (mnemonic: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  dispatch(setIsRegistering(true))
  try {
    await backendMiddleware.recoverSeed(mnemonic)
  } catch (e) {
    return dispatch(setIsRegistering(false))
  }

  const backup = await backendMiddleware.fetchBackup()
  return dispatch(recoverIdentity(backup))

  // TODO ask user for backup if nothing is stored in the cloud
  return
}

export const recoverIdentity = (backup?: BackupData): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const did = backup ? await backendMiddleware.recoverData(backup) : undefined
  const identity = await backendMiddleware.recoverIdentity(did)

  dispatch(setDid(identity.did))
  dispatch(setSeedPhraseSaved())
  dispatch(withLoading(backupData()))
  dispatch(setIsRegistering(false))
  return dispatch(navigatorResetHome())
}
