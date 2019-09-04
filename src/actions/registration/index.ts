import { navigationActions } from 'src/actions/'
import { routeList } from 'src/routeList'
import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { JolocomLib } from 'jolocom-lib'
import { generateSecureRandomBytes } from 'src/lib/util'
import { ThunkAction } from 'src/store'
import { navigatorResetHome } from '../navigation'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { setSeedPhraseSaved } from '../recovery'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { AnyAction } from 'redux'
import { KeyTypes } from 'jolocom-lib/js/vaultedKeyProvider/types'

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
): Promise<AnyAction | void> => {
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

  const { registry, encryptionLib } = backendMiddleware

  const password = (await generateSecureRandomBytes(32)).toString('base64')

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
  dispatch(setLoadingMsg(loading.loadingStages[3]))
  await dispatch(
    storeIdentity(
      identityWallet,
      encryptionLib.encryptWithPass({ data: encodedEntropy, pass: password }),
      // TODO refactor with new lib version
      // userVault['encryptedSeed'].toString('hex'),
      password,
    ),
  )

  dispatch(setIsRegistering(false))
  return dispatch(navigatorResetHome())
}

export const recoverIdentity = (seedPhrase: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
): Promise<AnyAction | void> => {
  const password = (await generateSecureRandomBytes(32)).toString('base64')
  dispatch(setIsRegistering(true))
  const userVault = JolocomLib.KeyProvider.recoverKeyPair(
    seedPhrase,
    password,
  ) as SoftwareKeyProvider

  const identityWallet = await backendMiddleware.registry.authenticate(
    userVault,
    {
      encryptionPass: password,
      derivationPath: KeyTypes.jolocomIdentityKey,
    },
  )
  await dispatch(
    storeIdentity(
      identityWallet,

      // TODO refactor with new lib version
      userVault['encryptedSeed'].toString('hex'),
      password,
    ),
  )

  // The user already knows his seed phrase, will perform reset navigate HOME
  dispatch(setIsRegistering(false))
  dispatch(setSeedPhraseSaved())
  return dispatch(navigationActions.navigatorResetHome())
}

const storeIdentity = (
  identityWallet: IdentityWallet,
  encEntropy: string,
  password: string,
): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
): Promise<void> => {
  const { storageLib, keyChainLib } = backendMiddleware
  backendMiddleware.identityWallet = identityWallet
  dispatch(setDid(identityWallet.did))
  const entropyData = { encryptedEntropy: encEntropy, timestamp: Date.now() }
  const personaData = {
    did: identityWallet.did,
    controllingKeyPath: JolocomLib.KeyTypes.jolocomIdentityKey,
  }

  dispatch(setDid(identityWallet.identity.did))
  dispatch(setLoadingMsg(loading.loadingStages[3]))

  await storageLib.store.didDoc(identityWallet.didDocument)
  backendMiddleware.identityWallet = identityWallet

  await keyChainLib.savePassword(password)
  await storageLib.store.encryptedSeed(entropyData)
  await storageLib.store.persona(personaData)
}
