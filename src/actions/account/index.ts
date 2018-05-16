import { AnyAction, Dispatch } from 'redux'
import { navigationActions, genericActions } from 'src/actions/'
import { BackendMiddleware } from 'src/backendMiddleware'
import { routeList } from 'src/routeList'
import { claimsMetadata } from 'jolocom-lib'

export const setDid = (did: string) => {
  return {
    type: 'DID_SET',
    value: did
  }
}

// TODO MOVE?
export const addVerifiableCredential = () => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware : BackendMiddleware) => {
    const { jolocomLib, storageLib, encryptionLib, keyChainLib, ethereumLib } = backendMiddleware

    const cred = jolocomLib.credentials.createCredential(claimsMetadata.emailAddress, 'eugeniu@gmail.com', 'eugeniu')

    const { did } = getState().account
    const activePersona = await storageLib.get.persona( {did} )
    const controllingKey = activePersona[0].controllingKey

    const wif = encryptionLib.decryptWithPass({ 
      cipher: controllingKey.encryptedWif,
      pass: await keyChainLib.getPassword()
    })

    const { privateKey } = ethereumLib.wifToEthereumKey(wif)
    const wallet = jolocomLib.wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
    const vC = await wallet.signCredential(cred)
    storageLib.store.verifiableCredential(vC.toJSON())
  }
}

// TODO Abstract parsing of error messages
export const checkIdentityExists = () => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware : BackendMiddleware) => {
    const { storageLib } = backendMiddleware
    try {
      const personas = await storageLib.get.persona()
      if (!personas.length) {
        return
      }

      dispatch(setDid(personas[0].did))
      dispatch(navigationActions.navigate({ routeName: routeList.Identity }))
    } catch(err) {
      if (err.message.indexOf('no such table') === 0) {
        return
      }

      dispatch(genericActions.showErrorScreen(err))
    }
  }
}
