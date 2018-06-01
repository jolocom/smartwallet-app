import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { ClaimsState, DecoratedClaims } from 'src/reducers/account'

let categorizedClaims = new Map<string, DecoratedClaims[]>()
categorizedClaims.set(
  'personal',
  [{
    displayName: 'Name',
    type: ['Credential', 'ProofOfNameCredential'],
    claims: [{
      id: 'default1',
      value: 'name',
    }],
  }]
)
categorizedClaims.set(
  'contact',
  [{
    displayName: 'E-mail',
    type: ['Credential', 'ProofOfEmailCredential'],
    claims: [{
      id: 'default2',
      value: ''
    }],
  },
  {
    displayName: 'Phone',
    type: ['Credential', 'ProofOfPhoneCredential'],
    claims: [{
      id: 'default3',
      value: ''
    }],
  }]
)

const initialState: ClaimsState = {
  loading: false,
  selected: {
    displayName: '',
    type: ['', ''],
    claims: []
  },
  claims: categorizedClaims
}

export const claims = (state = Immutable.fromJS(initialState), action: AnyAction): ClaimsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return state.setIn(['loading'], action.loading)
    case 'GET_CLAIMS_DID':
      return state.setIn(['savedClaims'], action.claims).setIn(['loading'], false)
    case 'SET_SELECTED':
      return state.setIn(['selected'], action.selected)
    default:
      return state
  }
}
