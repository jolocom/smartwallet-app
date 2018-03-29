import { AnyAction } from 'redux'

export const did = (state = '', action: AnyAction): string => {
  switch (action.type) {
    case 'DID_SET':
      return action.value
    default:
      return state
  }
}
