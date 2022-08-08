import { addCredentials, deleteCredential, setCredentials } from './actions'
import { CredentialsActionType, CredentialsState } from './types'

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
    case CredentialsActionType.setCredentials:
      return { ...state, all: action.payload }
    case CredentialsActionType.addCredentials:
      return action.payload
        ? { ...state, all: [...state.all, ...action.payload] }
        : state
    case CredentialsActionType.deleteCredential:
      const filtered = state.all.filter((c) => c.id !== action.payload)
      return { ...state, all: filtered }
    default:
      return state
  }
}

export default credentialsReducer
