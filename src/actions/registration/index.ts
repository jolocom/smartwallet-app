import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { ThunkAction } from 'src/store'
import { navigatorResetHome } from '../navigation'
import { setSeedPhraseSaved } from '../recovery'
import { generateSecureRandomBytes } from '@jolocom/sdk/js/src/lib/util'
import { accountActions } from '..'

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
  const password = (await generateSecureRandomBytes(32)).toString('base64')
  // and it's too fast so slow down
  await humanTimeout()

  // strings.ENCRYPTING_AND_STORING_DATA_LOCALLY
  dispatch(setLoadingMsg(loading.loadingStages[1]))
  const identity = await sdk.createNewIdentity(password)
  await humanTimeout()

  // strings.PREPARING_LAUNCH
  dispatch(setLoadingMsg(loading.loadingStages[2]))
  dispatch(setDid(identity.did))
  await humanTimeout()
  dispatch(setIsRegistering(false))
  await dispatch(accountActions.checkLocalDeviceAuthSet)

  return dispatch(navigatorResetHome())
}

export const recoverIdentity = (mnemonic: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  dispatch(setIsRegistering(true))
  let identity
  try {
    identity = await backendMiddleware.init({ mnemonic })
  } catch (e) {
    dispatch(setIsRegistering(false))
    throw e
  }

  dispatch(setDid(identity.did))
  dispatch(setSeedPhraseSaved())

  dispatch(setIsRegistering(false))
  return dispatch(navigatorResetHome())
}
