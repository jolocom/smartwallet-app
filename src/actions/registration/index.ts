import { navigationActions } from 'src/actions/'
import { routeList } from 'src/routeList'
import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { JolocomLib } from 'jolocom-lib'
import { generateSecureRandomBytes } from 'src/lib/util'
import { ThunkAction } from '../../store'

const bip39 = require('bip39')

export enum InitAction {
  CREATE = 'create',
  RECOVER = 'recover',
}
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

export const selectInitAction = (action: string): ThunkAction => dispatch => {
  switch (action) {
    case InitAction.CREATE: {
      return dispatch(
        navigationActions.navigate({
          routeName: routeList.Entropy,
        }),
      )
    }
    case InitAction.RECOVER: {
      // TODO open recover screen
      return dispatch(
        navigationActions.navigate({
          routeName: routeList.Entropy,
        }),
      )
    }
    default: {
      console.error('Wrong Init Action')
      return dispatch(
        navigationActions.navigate({
          routeName: routeList.Landing,
        }),
      )
    }
  }
}

export const openInitAction: ThunkAction = dispatch => {
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.InitAction,
    }),
  )
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
    navigationActions.navigate({
      routeName: routeList.Entropy,
    }),
  )
}

export const createIdentity = (encodedEntropy: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const { encryptionLib, keyChainLib, storageLib, registry } = backendMiddleware

  const password = await keyChainLib.getPassword()
  const encEntropy = encryptionLib.encryptWithPass({
    data: encodedEntropy,
    pass: password,
  })
  const entropyData = { encryptedEntropy: encEntropy, timestamp: Date.now() }
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

  await storageLib.store.encryptedSeed(entropyData)
  await storageLib.store.persona(personaData)

  return dispatch(
    navigationActions.navigatorReset({
      routeName: routeList.SeedPhrase,
      params: { mnemonic: bip39.entropyToMnemonic(encodedEntropy) },
    }),
  )
}
