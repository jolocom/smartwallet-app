import { AnyAction } from 'redux'
import { NavigationActions } from 'react-navigation'
import * as Keychain from 'react-native-keychain'

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
  return (dispatch: Dispatch) => {
    dispatch(setSeedPhrase('supreme dinosaur surge pretty hard pony tool obscure meat leader that nasty'))
  }
}

export const savePassword = (password : string) => {
  return async (dispatch : Dispatch) =>  {
    const username = 'jolocomSmartWallet'
    try {
      await Keychain.setGenericPassword(username, password)
      dispatch(NavigationActions.navigate({ routeName: 'SeedPhrase' }))
    } catch (err) {
    }
  }
}
