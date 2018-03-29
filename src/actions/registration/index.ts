import { AnyAction } from 'redux'
import { NavigationActions } from 'react-navigation'

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
