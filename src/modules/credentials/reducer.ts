import { ActionI } from '~/types/action'
import { CredentialActions } from './types'

const initialState = {
  all: [],
}

const credentialsReducer = (
  state = initialState,
  action: ActionI<CredentialActions>,
) => {
  switch (action.type) {
    case CredentialActions.setCredentials:
      return { ...state, all: action.payload }
    default:
      return state
  }
}

export default credentialsReducer
