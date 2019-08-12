import { navigationActions } from 'src/actions/'
import { routeList } from 'src/routeList'
import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { JolocomLib } from 'jolocom-lib'
import { generateSecureRandomBytes } from 'src/lib/util'
import { AnyAction, ThunkAction } from 'src/store'
import { navigatorResetHome } from '../navigation'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { setSeedPhraseSaved } from '../recovery'

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
      return dispatch(startRegistration)
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

  const { encryptionLib, keyChainLib, registry } = backendMiddleware

  const password = await keyChainLib.getPassword()
  const encEntropy = encryptionLib.encryptWithPass({
    data: encodedEntropy,
    pass: password,
  })
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
  backendMiddleware.identityWallet = await registry.create(userVault, password)
  dispatch(setLoadingMsg(loading.loadingStages[3]))
  await dispatch(storeIdentity(encEntropy))

  dispatch(setIsRegistering(false))
  return dispatch(navigatorResetHome())
}

export const recoverIdentity = (seedPhrase: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
): Promise<AnyAction | void> => {
  const { keyChainLib } = backendMiddleware

  const password = (await generateSecureRandomBytes(32)).toString('base64')

  await keyChainLib.savePassword(password)
  const userVault = JolocomLib.KeyProvider.recoverKeyPair(
    seedPhrase,
    password,
  ) as SoftwareKeyProvider
  await backendMiddleware.setIdentityWallet(userVault, password)

  await dispatch(storeIdentity(userVault['encryptedSeed'].toString('hex')))
  await dispatch(setSeedPhraseSaved())
  return dispatch(navigatorResetHome())
}

const storeIdentity = (encEntropy: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
): Promise<void> => {
  const { storageLib } = backendMiddleware
  dispatch(setDid(backendMiddleware.identityWallet.identity.did))
  const entropyData = { encryptedEntropy: encEntropy, timestamp: Date.now() }
  const personaData = {
    did: backendMiddleware.identityWallet.identity.did,
    controllingKeyPath: JolocomLib.KeyTypes.jolocomIdentityKey,
  }

  await storageLib.store.encryptedSeed(entropyData)
  await storageLib.store.persona(personaData)
}
