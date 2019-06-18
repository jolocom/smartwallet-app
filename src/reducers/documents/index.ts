import { AnyAction } from 'redux'
import { SET_DOC_DETAIL, CLEAR_DOC_DETAIL } from 'src/actions/documents'
import { DecoratedClaims } from '../account'

export interface DocumentsState {
  selectedDocument: DecoratedClaims
}

const initialState: DocumentsState = {
  selectedDocument: {
    credentialType: '',
    subject: '',
    id: '',
    issuer: {
      did: '',
    },
    expires: undefined,
    claimData: {
      type: '',
      documentNumber: '',
    },
  },
}

export const documentsReducer = (
  state = initialState,
  action: AnyAction,
): DocumentsState => {
  switch (action.type) {
    case SET_DOC_DETAIL:
      return { ...state, selectedDocument: action.value }
    case CLEAR_DOC_DETAIL:
      return {
        ...state,
        selectedDocument: initialState.selectedDocument,
      }
    default:
      return state
  }
}
