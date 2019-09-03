import { ThunkAction } from '../store'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { navigationActions } from './index'
import { routeList } from '../routeList'
import settingKeys from '../ui/settings/settingKeys'
import { SocialRecovery } from 'jolocom-lib/js/recovery/socialRecovery'
import { mnemonicToEntropy } from 'bip39'
import { OWN_SHARD_LABEL } from '../lib/storage/entities/shardEntity'

export enum ActionTypes {
  SET_OWN_SHARDS = 'SET_OWN_SHARDS',
  SET_RECEIVED_SHARDS = 'ADD_RECEIVED_SHARDS',
}
export const showSeedPhrase = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const encryptedSeed = await backendMiddleware.storageLib.get.encryptedSeed()
  if (!encryptedSeed) {
    throw new Error('Can not retrieve Seed from database')
  }
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

export const openSocialRecovery = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const { storageLib } = backendMiddleware
  const isInitialized = await storageLib.get.setting(settingKeys.shardsCreated)
  if (!isInitialized) {
    await dispatch(initSocialRecovery())
  }
  const shards = await storageLib.get.shards(OWN_SHARD_LABEL)
  dispatch({
    type: ActionTypes.SET_OWN_SHARDS,
    value: shards.map(s => s.value),
  })
  dispatch(navigationActions.navigate({ routeName: routeList.SocialRecovery }))
}

export const initSocialRecovery = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const { storageLib, keyChainLib, identityWallet } = backendMiddleware

  /**
   * TODO Use generated recovery key instead!!
   * BEGIN HACK
   */
  const encryptedSeed = await storageLib.get.encryptedSeed()
  if (!encryptedSeed) {
    throw new Error('Can not retrieve Seed from database')
  }

  const password = await keyChainLib.getPassword()
  const vault = new SoftwareKeyProvider(Buffer.from(encryptedSeed, 'hex'))
  const entropy = mnemonicToEntropy(vault.getMnemonic(password))
  /**
   * END HACK
   */
  const shards = SocialRecovery.createShards(identityWallet.did, entropy, 5, 3)
  for (const shard of shards) {
    await storageLib.store.shard({
      label: OWN_SHARD_LABEL,
      value: shard,
    })
  }
  await backendMiddleware.storageLib.store.setting(
    settingKeys.shardsCreated,
    true,
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
  dispatch({
    type: 'SET_SEED_PHRASE_SAVED',
  })
  return dispatch(navigationActions.navigatorResetHome())
}

export const handelReceiveShard = (shard: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  console.log(shard)
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.AcceptShard,
      params: { shard },
    }),
  )
}

export const saveReceivedShard = (
  shard: string,
  label: string,
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  await backendMiddleware.storageLib.store.shard({ label, value: shard })
  return dispatch(navigationActions.navigatorResetHome())
}

export const openReceivedShards = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const allShards = await backendMiddleware.storageLib.get.shards()
  dispatch({
    type: ActionTypes.SET_RECEIVED_SHARDS,
    value: allShards.filter(shard => shard.label !== OWN_SHARD_LABEL),
  })

  dispatch(navigationActions.navigate({routeName: routeList.ReceivedShards}))
}
