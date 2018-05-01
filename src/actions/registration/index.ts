import { AnyAction, Dispatch } from 'redux'
import { navigationActions, genericActions } from 'src/actions/'

export const setLoadingMsg = (loadingMsg: string) => {
  return {
    type: 'SET_LOADING_MSG',
    value: loadingMsg
  }
}

export const savePassword = (password : string) => {
  return async (dispatch : Dispatch<AnyAction>, getState: any, { backendMiddleware } : any) =>  {
    await backendMiddleware.keyChainLib.savePassword(password)
    dispatch(navigationActions.navigate({ routeName: 'Entropy' }))
  }
}

export const submitEntropy = (encodedEntropy: string) => {
  return (dispatch : Dispatch<AnyAction>) => {
    dispatch(navigationActions.navigate({
      routeName: 'Loading',
      params: { encodedEntropy }
    }))
  } 
}

export const createIdentity = (encodedEntropy: string) => {
  return async (dispatch : Dispatch<AnyAction>, getState: any, { backendMiddleware } : any) => {
    const { jolocomLib, ethereumLib, storageLib, encryptionLib, keyChainLib } = backendMiddleware
    try {
      const {
        didDocument,
        mnemonic,
        genericSigningKey,
        ethereumKey
      } = await jolocomLib.identity.create(encodedEntropy)

      dispatch(setLoadingMsg('Encrypting and storing data locally'))

      const password = await keyChainLib.getPassword()
      const encEntropy = encryptionLib.encryptWithPass({ data: encodedEntropy, pass: password }).toString()
      const encEthWif = encryptionLib.encryptWithPass({ data: ethereumKey.wif, pass: password }).toString()
      const encGenWif = encryptionLib.encryptWithPass({ data: genericSigningKey.wif, pass: password }).toString()

      await storageLib.addMasterKey(encEntropy)
      await storageLib.addDerivedKey({
        encryptedWif: encGenWif,
        path: genericSigningKey.path,
        entropySource: 1,
        keyType: genericSigningKey.keyType
      })

      await storageLib.addDerivedKey({
        encryptedWif: encEthWif,
        path: ethereumKey.path,
        entropySource: 1,
        keyType: ethereumKey.keyType
      })

      await storageLib.addPersona({
        did: didDocument.id,
        controllingKey: 2
      })

      const {
        privateKey: ethPrivKey,
        address: ethAddr
      } = ethereumLib.wifToEthereumKey(ethereumKey.wif)

      dispatch(setLoadingMsg('Storing data on IPFS'))
      const ipfsHash = await jolocomLib.identity.store(didDocument)

      dispatch(setLoadingMsg('Fueling with Ether'))
      await ethereumLib.requestEther(ethAddr)

      dispatch(setLoadingMsg('Registering identity on Ethereum'))
      await jolocomLib.identity.register({
        ethereumKey: Buffer.from(ethPrivKey, 'hex'),
        did: didDocument.id,
        ipfsHash
      })

      dispatch(navigationActions.navigate({
        routeName: 'SeedPhrase',
        params: { mnemonic }
      }))
    } catch (error) {
      return dispatch(genericActions.showErrorScreen(error))
    }

  }
}
