import { AnyAction, Dispatch } from 'redux'
import { navigationActions, genericActions } from 'src/actions/'
import { BackendMiddleware } from 'src/backendMiddleware'
import { routeList } from 'src/routeList'
import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { JolocomLib } from 'jolocom-lib'
import { generateMnemonic } from 'jolocom-lib/js/utils/keyDerivation'

export const setLoadingMsg = (loadingMsg: string) => {
  return {
    type: 'SET_LOADING_MSG',
    value: loadingMsg
  }
}

export const savePassword = (password : string) => {
  return async (dispatch : Dispatch<AnyAction>, getState: Function, backendMiddleware : BackendMiddleware) =>  {
    try {
      await backendMiddleware.keyChainLib.savePassword(password)
      dispatch(navigationActions.navigatorReset({ routeName: routeList.Entropy }))
    } catch (err) {
      dispatch(genericActions.showErrorScreen(err))
    }
  }
}

export const submitEntropy = (encodedEntropy: string) => {
  return (dispatch : Dispatch<AnyAction>) => {
    dispatch(navigationActions.navigatorReset({
      routeName: routeList.Loading
    }))

    dispatch(setLoadingMsg(loading.loadingStages[0]))

    setTimeout(() => {
      dispatch(createIdentity(encodedEntropy))
    }, 2000)
  } 
}

export const startRegistration = () => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(navigationActions.navigatorReset({
      routeName: routeList.PasswordEntry
    }))
  }
}

export const finishRegistration = () => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(navigationActions.navigatorReset( 
      {routeName: routeList.Home }
    ))
  }
}

export const createIdentity = (encodedEntropy: string) => {
  return async (dispatch : Dispatch<AnyAction>, getState: Function, backendMiddleware : BackendMiddleware) => {
    const { ethereumLib,  encryptionLib, keyChainLib } = backendMiddleware
    const seed = Buffer.from(encodedEntropy, 'hex')
    console.log('create identity start: ', seed)
    try {
      const identityManager = JolocomLib.identityManager.create(seed)
     
      const schema = identityManager.getSchema()
      const identityKey = identityManager.deriveChildKey(schema.jolocomIdentityKey)
      const ethereumKey = identityManager.deriveChildKey(schema.ethereumKey)
      
      const ethAddr = ethereumLib.privKeyToEthAddress(ethereumKey.privateKey)
      
      await ethereumLib.requestEther(ethAddr)

      console.log('eth address: ', ethAddr)
      
      
      
      const registry = JolocomLib.registry.jolocom.create()
      console.log('registry: ', registry)
      
      const identityWallet = await registry.create({
        privateIdentityKey: identityKey.privateKey, 
        privateEthereumKey: ethereumKey.privateKey
      })

      const password = await keyChainLib.getPassword()
      const encEntropy = encryptionLib.encryptWithPass({ data: encodedEntropy, pass: password })
      const encEthWif = encryptionLib.encryptWithPass({ data: ethereumKey.wif, pass: password })
      const encGenWif = encryptionLib.encryptWithPass({ data: identityKey.wif, pass: password })

      const masterKeyData = {
        encryptedEntropy: encEntropy,
        timestamp: Date.now()
      }

      const genericSigningKeyData = {
        encryptedWif: encGenWif,
        path: identityKey.path,
        keyType: identityKey.keyType,
        entropySource: masterKeyData
      }

      const ethereumKeyData = {
        encryptedWif: encEthWif,
        path: ethereumKey.path,
        keyType: ethereumKey.keyType,
        entropySource: masterKeyData
      }
      console.log('ethereum Data: ', ethereumKeyData)
      const personaData = {
        did: identityWallet.getIdentity().getDID(),
        controllingKey: genericSigningKeyData
      }
      console.log('persona Data: ', personaData)

      // await storageLib.store.persona(personaData)
      // await storageLib.store.derivedKey(ethereumKeyData)

      dispatch(setDid(identityWallet.getIdentity().getDID()))
     
      // dispatch(setLoadingMsg(loading.loadingStages[1]))
      
      // dispatch(setLoadingMsg(loading.loadingStages[2]))
     //  dispatch(setLoadingMsg('Registering identity on Ethereum'))

      // await jolocomLib.identity.register({
      //   ethereumKey: Buffer.from(ethPrivKey, 'hex'),
      //   did: didDocument.getDID(),
      //   ipfsHash
      // })

      const mnemonic = generateMnemonic(seed)
      
      dispatch(navigationActions.navigatorReset({
        routeName: routeList.SeedPhrase,
        params: { mnemonic }
      }))
    } catch (error) {
      return dispatch(genericActions.showErrorScreen(error))
    }
  }
}
