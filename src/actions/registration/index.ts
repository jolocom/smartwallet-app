import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { navigatorResetHome } from '../navigation'
import { setSeedPhraseSaved } from '../recovery'
import { generateSecureRandomBytes } from '@jolocom/sdk/js/src/lib/util'
import { ThunkAction } from '../../store'
import { entropyToMnemonic } from 'bip39'
import { genericActions } from '..'
import useResetKeychainValues from 'src/ui/deviceauth/hooks/useResetKeychainValues'
import { PIN_SERVICE } from 'src/ui/deviceauth/utils/keychainConsts'

const humanTimeout = () => new Promise(resolve => setTimeout(resolve, 1000))

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
  sdk,
) => {
  const isRegistering = getState().registration.loading.isRegistering
  if (isRegistering) return

  dispatch(setIsRegistering(true))

  // strings.REGISTERING_DECENTRALIZED_IDENTITY
  // aka "we are generating a random number"
  dispatch(setLoadingMsg(loading.loadingStages[0]))

  const seed = await generateSecureRandomBytes(16)
  const password = (await generateSecureRandomBytes(32)).toString('base64')
  // const identity = await sdk.createNewIdentity(password)
  const identity = await sdk.loadFromMnemonic(entropyToMnemonic(seed), password)
  // and it's too fast so slow down
  await humanTimeout()

  // strings.ENCRYPTING_AND_STORING_DATA_LOCALLY
  dispatch(setLoadingMsg(loading.loadingStages[1]))

  // TODO Better call here.
  const encryptedSeed = await identity.asymEncryptToDid(
    Buffer.from(seed),
    identity.did, {
      prefix: '',
      resolve: async _ => identity.identity
    })

  await sdk.storageLib.store.setting(
    'encryptedSeed',
    {
      b64Encoded: encryptedSeed.toString('base64')
    }
  )
  await humanTimeout()

  // strings.PREPARING_LAUNCH
  dispatch(setLoadingMsg(loading.loadingStages[2]))
  dispatch(setDid(identity.did))
  await humanTimeout()
  dispatch(setIsRegistering(false))

  // clear the saved PIN code, if any
  await useResetKeychainValues(PIN_SERVICE)()

  dispatch(navigatorResetHome())
  return dispatch(genericActions.lockApp())
}

export const recoverIdentity = (mnemonic: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  dispatch(setIsRegistering(true))

  try {
    const password = (await generateSecureRandomBytes(32)).toString('base64')
    const identity = await backendMiddleware.loadFromMnemonic(mnemonic, password)
    dispatch(setDid(identity.did))
    dispatch(setSeedPhraseSaved())

    dispatch(setIsRegistering(false))
    return dispatch(navigatorResetHome())
  } catch (e) {
    dispatch(setIsRegistering(false))
    throw e
  }
}
