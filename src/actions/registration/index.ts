import { AnyAction } from 'redux'
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
      dispatch(NavigationActions.navigate({ routeName: 'SeedPhrase' }))
    }
  }
}
