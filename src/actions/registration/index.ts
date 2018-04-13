import { AnyAction } from 'redux'
import { BackendMiddleware } from 'src/backendMiddleware'
import { NavigationActions } from 'react-navigation'
import { KeyChain } from 'src/lib/keychain'

// TODO MOVE
type Dispatch = (action: AnyAction) => void;

export const setSeedPhrase = (seedPhrase: string) : AnyAction => {
  return {
    type: 'SEEDPHRASE_SET',
    value: seedPhrase
  }
}

export const clearSeedPhrase = () : AnyAction => {
  return {
    type: 'SEEDPHRASE_CLEAR'
  }
}

// TODO Retrieval of encrypted key.
export const fetchSeedPhrase = () => {
  return async (dispatch: Dispatch) => {
    dispatch(setSeedPhrase('Mock Seed Phrase'))
  }
}

export const savePassword = (password : string) => {
  return async (dispatch : Dispatch) =>  {
    const KC = new KeyChain()
    const success = await KC.savePassword(password)
    if (success) {
    console.log("KEYCHAIN")

      dispatch(NavigationActions.navigate({ routeName: 'Loading' }))
    }
  }
}

export const setLoadingMsg = (loadingMsg: string) => {
  return {
    type: 'SET_LOADING_MSG',
    value: loadingMsg
  }
}

export const generateAndEncryptKeyPairs = () => {
  return async (dispatch : Dispatch, getState: any, { backendMiddleware } : any) => {
    const randomString = 'c1ac02ceac06bda925a011a7d2134957' // TODO: grab from the state
    const password = 'Password1' // TODO: grab from the state

    dispatch(setLoadingMsg('Generating keys'))

    console.log(getState)
    const {
      didDocument,
      mnemonic,
      masterKeyWIF,
      genericSigningKeyWIF,
      ethereumKeyWIF
    } = backendMiddleware.jolocomLib.identity.create(randomString)
    console.log(didDocument)

    dispatch(setLoadingMsg('Fueling with Ether'))

    const ddoHash = await backendMiddleware.jolocomLib.identity.store(didDocument)
    console.log(ddoHash)
  }
}
