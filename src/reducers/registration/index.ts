import { AnyAction } from 'redux'

export const seedPhrase = (state = '', action: AnyAction): string => {
  switch (action.type) {
    case 'SEEDPHRASE_SET':
      return action.value
    case 'SEEDPHRASE_CLEAR':
      return ''
    default:
      return state
  }
}

export const passwordEntry = (state = '', action : AnyAction) : string => {

  switch (action.type) {
    case 'SAVE_PASSWORD':
      //TODO: indication to user that password saved correctly?
      return state

    default:
      return state
  }
}
