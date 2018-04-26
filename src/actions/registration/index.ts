import { AnyAction } from 'redux'
import { KeyChain } from 'src/lib/keychain'
import { navigationActions } from 'src/actions/'

// TODO MOVE
type Dispatch = (action: AnyAction) => void

export const setLoadingMsg = (loadingMsg: string) => {
  return {
    type: 'SET_LOADING_MSG',
    value: loadingMsg
  }
}

export const savePassword = (password : string) => {
  return async (dispatch : Dispatch) =>  {
    await new KeyChain().savePassword(password)
    dispatch(navigationActions.navigate({ routeName: 'Entropy' }))
  }
}

export const submitEntropy = (encodedEntropy: string) => {
  return (dispatch : Dispatch) => {
    dispatch(navigationActions.navigate({
      routeName: 'Loading',
      params: { encodedEntropy }
    }))
  } 
}

// TODO Error handling
export const generateAndEncryptKeyPairs = (encodedEntropy: string) => {
  return async (dispatch : Dispatch, getState: any, { backendMiddleware } : any) => {
    const { jolocomLib, ethereumLib } = backendMiddleware

    const {
      didDocument,
      mnemonic,
      // masterKeyWIF,
      // genericSigningKeyWIF,
      ethereumKeyWIF
    } = await jolocomLib.identity.create(encodedEntropy)

    const { privateKey, address } = ethereumLib.wifToEthereumKey(ethereumKeyWIF)

    dispatch(setLoadingMsg('Storing data on IPFS'))
    const ipfsHash = await jolocomLib.identity.store(didDocument)

    dispatch(setLoadingMsg('Fueling with Ether'))
    await ethereumLib.requestEther(address)

    dispatch(setLoadingMsg('Registering identity on Ethereum'))
    await jolocomLib.identity.register({
      ethereumKey: Buffer.from(privateKey, 'hex'),
      did: didDocument.id,
      ipfsHash
    })

    const encryptionPass = await new KeyChain().getPassword()

    if (!encryptionPass.found) {
    }

    dispatch(setLoadingMsg('storing of encrypted data comming soon!'))

    dispatch(navigationActions.navigate({
      routeName: 'SeedPhrase',
      params: { mnemonic }
    }))
  }
}
