import { CredentialActions, CredentialsState } from './types'
import { setCredentials, addCredentials, deleteCredential } from './actions'

//TODO: check if additional nesting is required
const initialState: CredentialsState = {
  all: [],
}
const credentialsReducer = (
  state = initialState,
  action: ReturnType<
    typeof setCredentials | typeof addCredentials | typeof deleteCredential
  >,
) => {
  switch (action.type) {
    case CredentialActions.setCredentials:
      return { ...state, all: action.payload }
    case CredentialActions.addCredentials:
      return { ...state, all: [...state.all, ...action.payload] }
    case CredentialActions.deleteCredential:
      const filtered = state.all.filter((c) => c.id !== action.payload)
      return { ...state, all: filtered }
    default:
      return state
  }
}

export default credentialsReducer
