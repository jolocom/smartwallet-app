import { AnyAction } from 'redux'

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
  return (dispatch: (action: AnyAction) => void) => {
    dispatch(setSeedPhrase('supreme dinosaur surge pretty hard pony tool obscure meat leader that nasty'))
  }
}

export const setLoadingMsg = (loadingMsg: string) => {
  return {
    type: 'SET_LOADING_MSG',
    value: loadingMsg
  }
}

export const startLoading = (loading: boolean) => {
  return {
    type: 'START_LOADING',
    value: loading
  }
}

export const finishLoading = (loading: boolean) => {
  return {
    type: 'FINISH_LOADING',
    value: loading
  }
}

export const generateAndEncryptKeyPairs = () => {
  return (dispatch: (actions: AnyAction) => void, {backendMiddleware}) => {
    const randomString = '13912643311766764847120568039921' // TODO: grab from the state
    const password = 'Password1' // TODO: grab from the state

    dispatch(setLoadingMsg('Generating keys'))

    const {
      didDocument,
      mnemonic,
      masterKeyWIF,
      genericSigningKeyWIF,
      ethereumKeyWIF
    } = backendMiddleware.jolocomLib.identity.create(randomString)

    dispatch(setLoadingMsg('Fueling with Ether'))
  }
}
