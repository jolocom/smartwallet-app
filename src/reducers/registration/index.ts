import { AnyAction } from 'redux'

export const entropy = (state = {}, action: AnyAction): any => {
  // console.log(action, state, 'reducer')
  switch (action.type) {
    case 'ENTROPY_READY':
      return Object.assign({}, state, {
      encodedEntropy: action.value
      })
    default:
      return state
  }
}

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
