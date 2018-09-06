import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { ClaimsState, CategorizedClaims } from 'src/reducers/account'

const categorizedClaims: CategorizedClaims = {
  'Personal': [{
    displayName: 'Name',
    type: ['Credential', 'ProofOfNameCredential'],
    claims: [{
      id: '',
      name: 'name',
      value: '',
    }],
  }],
  'Contact': [{
    displayName: 'E-mail',
    type: ['Credential', 'ProofOfEmailCredential'],
    claims: [{
      id: '',
      name: 'email',
      value: ''
    }],
  },
  {
    displayName: 'Phone',
    type: ['Credential', 'ProofOfMobilePhoneNumberCredential'],
    claims: [{
      id: '',
      name: 'telephone',
      value: ''
    }],
  }]
}

export const initialState: ClaimsState = {
  loading: false,
  selected: {
    displayName: '',
    type: ['', ''],
    claims: []
  },
  decoratedCredentials: categorizedClaims
}

export const claims = (state = Immutable.fromJS(initialState), action: AnyAction): ClaimsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return state.setIn(['loading'], action.loading)
    case 'SET_CLAIMS_FOR_DID':
      return state.setIn(['decoratedCredentials'], action.claims).setIn(['loading'], false)
    case 'SET_SELECTED':
      return state.setIn(['selected'], action.selected)
    default:
      return state
  }
}
