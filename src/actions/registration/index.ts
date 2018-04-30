import { AnyAction } from 'redux'
import { navigationActions } from 'src/actions/'
import { EncryptionLib } from 'src/lib/crypto'
import { Storage } from 'src/lib/storage'
import { KeyChain } from 'src/lib/keychain'

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
    const crypto = new EncryptionLib()
    const stAgent = new Storage()

    const {
      didDocument,
      mnemonic,
      genericSigningKey,
      ethereumKey
    } = await jolocomLib.identity.create(encodedEntropy)

    dispatch(setLoadingMsg('Encrypting and storing data locally'))
    const { password, found } = await (new KeyChain()).getPassword()

    if (!found) {
      // HANDLE
    }

    const encEntropy = crypto.encryptWithPass({ data: encodedEntropy, pass: password }).toString()
    const encEthWif = crypto.encryptWithPass({ data: ethereumKey.wif, pass: password }).toString()
    const encGenWif = crypto.encryptWithPass({ data: genericSigningKey.wif, pass: password }).toString()

    await stAgent.addMasterKey(encEntropy)
    await stAgent.addDerivedKey({
      encryptedWif: encGenWif,
      path: genericSigningKey.path,
      entropySource: 1,
      keyType: genericSigningKey.keyType
    })

    await stAgent.addDerivedKey({
      encryptedWif: encEthWif,
      path: ethereumKey.path,
      entropySource: 1,
      keyType: ethereumKey.keyType
    })

    await stAgent.addPersona({
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
  }
}
