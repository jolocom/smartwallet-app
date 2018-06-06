import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { ClaimsState, CategorizedClaims } from 'src/reducers/account'

let categorizedClaims: CategorizedClaims = {
  'Personal' : [{
      displayName: 'Name',
      type: ['Credential', 'ProofOfNameCredential'],
      claims: [{
        id: 'default1',
        name: 'name',
        value: 'name',
      }],
    }],
  'Contact': [{
      displayName: 'E-mail',
      type: ['Credential', 'ProofOfEmailCredential'],
      claims: [{
        id: 'default2',
        name: 'email',
        value: ''
      }],
    },
    {
      displayName: 'Phone',
      type: ['Credential', 'ProofOfMobilePhoneNumberCredential'],
      claims: [{
        id: 'default3',
        name: 'phone',
        value: ''
      }],
    }]
}

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
    case 'SET_CLAIMS_DID':
      return state.setIn(['claims'], action.claims).setIn(['loading'], false)
    case 'SET_SELECTED':
      return state.setIn(['selected'], action.selected)
    default:
      return state
  }
}
