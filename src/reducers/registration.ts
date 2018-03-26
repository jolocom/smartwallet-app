import { AnyAction } from 'redux'

export const seedPhrase = (state = '', action: AnyAction): string => {
  switch (action.type) {
    case 'SEEDPHRASE_SET':
      return action.value
    case 'SEEDPHRASE_CLEARED':
      return ''
    default:
      return state
  }
}
