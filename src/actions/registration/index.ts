import { AnyAction } from 'redux'
import { NavigationActions } from 'react-navigation'
import * as Keychain from 'react-native-keychain'

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

export const savePassword = (password : string) => {
  return async (dispatch : (action : AnyAction) => void) => {
    const username = 'jolocomSmartWallet'
    try {
      const res = await Keychain.setGenericPassword(username, password)
      // dispatch(NavigationActions.navigate({routeName: 'Entropy'}))
      return dispatch({
        type: 'SAVE_PASSWORD',
        response: res
      })
    } catch (err) {
      console.log('Save password Keychain error:', err)
      return dispatch({
        type: 'SAVE_PASSWORD',
        response: err
      })
    }
  }
}
