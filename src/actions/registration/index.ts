import { AnyAction } from 'redux'

export const submitEntropy = (entropy: any) => {
  return {
    type: 'ENTROPY_SUBMITTED',
    value: entropy
  }
}

export const drawUpon = () => {
  return {
    type: 'DRAWN_UPON',
    value: true
  }
}

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
