import { ActionI } from '~/types/action'
import { CredentialActions, CredentialsState } from './types'

//TODO: check if additional nesting is required
const initialState: CredentialsState = {
  all: [],
}

const credentialsReducer = (
  state = initialState,
  action: ActionI<CredentialActions>,
) => {
  switch (action.type) {
    case CredentialActions.setCredentials:
      return { ...state, all: action.payload }
    case CredentialActions.addCredential:
      return {...state, all: [...state.all, ...action.payload]}
    case CredentialActions.deleteCredential:
      const filtered = state.all.filter((c) => c.id !== action.payload)
      return { ...state, all: filtered }
    default:
      return state
  }
}

export default credentialsReducer
