import { navigationActions } from 'src/actions/'
import { routeList } from 'src/routeList'
import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { JolocomLib } from 'jolocom-lib'
import { generateSecureRandomBytes } from 'src/lib/util'
import { ThunkAction } from '../../store'
import { navigatorReset } from '../navigation'

const bip39 = require('bip39')

export const setLoadingMsg = (loadingMsg: string) => ({
  type: 'SET_LOADING_MSG',
  value: loadingMsg,
})

export const submitEntropy = (
  encodedEntropy: string,
): ThunkAction => dispatch => {
  dispatch(
    navigationActions.navigatorReset({
      routeName: routeList.Loading,
    }),
  )

  dispatch(setLoadingMsg(loading.loadingStages[0]))
  return dispatch(createIdentity(encodedEntropy))
}

export const startRegistration: ThunkAction = async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const randomPassword = await generateSecureRandomBytes(32)

  await backendMiddleware.keyChainLib.savePassword(
    randomPassword.toString('base64'),
  )

  return dispatch(
    navigationActions.navigatorReset({
      routeName: routeList.Entropy,
    }),
  )
}

export const finishRegistration = navigatorReset({ routeName: routeList.Home })

export const createIdentity = (encodedEntropy: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const { keyChainLib, storageLib, registry } = backendMiddleware

  const password = await keyChainLib.getPassword()

  const entropyData = { entropy: encodedEntropy, timestamp: Date.now() }
  const userVault = JolocomLib.KeyProvider.fromSeed(
    Buffer.from(encodedEntropy, 'hex'),
    password,
  )
  dispatch(setLoadingMsg(loading.loadingStages[1]))

  await JolocomLib.util.fuelKeyWithEther(
    userVault.getPublicKey({
      encryptionPass: password,
      derivationPath: JolocomLib.KeyTypes.ethereumKey,
    }),
  )

  dispatch(setLoadingMsg(loading.loadingStages[2]))
  const identityWallet = await registry.create(userVault, password)

  const personaData = {
    did: identityWallet.identity.did,
    controllingKeyPath: JolocomLib.KeyTypes.jolocomIdentityKey,
  }

  dispatch(setDid(identityWallet.identity.did))
  dispatch(setLoadingMsg(loading.loadingStages[3]))
  await backendMiddleware.setIdentityWallet(userVault, password)

  await storageLib.store.seedEncrypted(entropyData, password)
  await storageLib.store.persona(personaData)

  return dispatch(
    navigationActions.navigatorReset({
      routeName: routeList.SeedPhrase,
      params: { mnemonic: bip39.entropyToMnemonic(encodedEntropy) },
    }),
  )
}
