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

export const savePassword = () => {
  return async (dispatch : (action : AnyAction) => void) => {
    const username = 'natascha'
    const password = 'test'
    console.log('SAVE PASSWORD ACTION CREATOR')
    // await Keychain.setGenericPassword(username, password)
    //
    // try {
    //   const credentials = await Keychain.getGenericPassword()
    //   console.log('CREDENTIALS: ', credentials)
    // } catch (err) {
    //   console.log('ERROR GET CREDENTIALS: ', err)
    // }

    console.log('NAVIGATION ACTIONS: ', NavigationActions.navigate)
    return dispatch(NavigationActions.navigate({routeName: 'Landing'}))
  }
}
