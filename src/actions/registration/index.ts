import { navigationActions } from 'src/actions/'
import { routeList } from 'src/routeList'
import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { JolocomLib } from 'jolocom-lib'
import { generateSecureRandomBytes } from 'src/lib/util'
import { AnyAction, ThunkAction } from 'src/store'
import { navigatorResetHome } from '../navigation'
import { setSeedPhraseSaved } from '../recovery'
// @ts-ignore
import bip39 from 'bip39'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'

export enum InitAction {
  CREATE = 'create',
  RECOVER = 'recover',
}
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
      return dispatch(
        navigationActions.navigate({
          routeName: routeList.InputSeedPhrase,
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

export const openInitAction: ThunkAction = dispatch =>
  dispatch(
    navigationActions.navigate({
      routeName: routeList.InitAction,
    }),
  )

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

  const { registry } = backendMiddleware

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
      // TODO refactor with new lib version
      userVault['encryptedSeed'].toString('hex'),
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

  // validateMnemonic is using `String.normalize()` which does not work on the old JS Core of React Native
  const seed = Buffer.from(bip39.mnemonicToEntropy(seedPhrase), 'hex')
  const userVault = JolocomLib.KeyProvider.fromSeed(seed, password)

  const identityWallet = await backendMiddleware.authenticate(
    userVault,
    password,
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
  return dispatch(setSeedPhraseSaved())
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

  await keyChainLib.savePassword(password)
  await storageLib.store.encryptedSeed(entropyData)
  await storageLib.store.persona(personaData)
}
