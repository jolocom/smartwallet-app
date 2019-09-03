import { navigationActions } from 'src/actions/'
import { routeList } from 'src/routeList'
import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { JolocomLib } from 'jolocom-lib'
import { generateSecureRandomBytes } from 'src/lib/util'
import { ThunkAction } from 'src/store'
import { navigatorResetHome } from '../navigation'

export const setLoadingMsg = (loadingMsg: string) => ({
  type: 'SET_LOADING_MSG',
  value: loadingMsg,
})

export const setIsRegistering = (value: boolean) => ({
  type: 'SET_IS_REGISTERING',
  value,
})

export const submitEntropy = (
  encodedEntropy: string,
): ThunkAction => dispatch => {
  dispatch(
    navigationActions.navigate({
      routeName: routeList.RegistrationProgress,
    }),
  )

  dispatch(setLoadingMsg(loading.loadingStages[0]))
  return dispatch(createIdentity(encodedEntropy))
}

export const createIdentity = (encodedEntropy: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  // This is a just-in-case thing.... maybe multiple button taps or something
  const isRegistering = getState().registration.loading.isRegistering
  if (isRegistering) {
    return dispatch(
      navigationActions.navigate({
        routeName: routeList.RegistrationProgress,
      }),
    )
  }

  dispatch(setIsRegistering(true))

  const { keyChainLib, storageLib, registry } = backendMiddleware
  const password = (await generateSecureRandomBytes(32)).toString('base64')

  const userVault = JolocomLib.KeyProvider.fromSeed(
    Buffer.from(encodedEntropy, 'hex'),
    password,
  )

  const entropyData = {
    encryptedEntropy: userVault.encryptedSeed,
    timestamp: Date.now(),
  }

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

  await storageLib.store.didDoc(identityWallet.didDocument)
  backendMiddleware.identityWallet = identityWallet

  await keyChainLib.savePassword(password)
  await storageLib.store.encryptedSeed(entropyData)
  await storageLib.store.persona(personaData)

  dispatch(setIsRegistering(false))

  return dispatch(navigatorResetHome())
}
