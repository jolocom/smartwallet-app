import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { ClaimsState, DecoratedClaims } from 'src/reducers/account'

let categorizedClaims = new Map<string, DecoratedClaims[]>()
categorizedClaims.set(
  'personal',
  [{
    displayName: 'Name',
    claims: [{
      id: 'default1',
      type: 'NameCredential',
      value: 'name',
    }],
  }]
)
categorizedClaims.set(
  'contact',
  [{
    displayName: 'E-mail',
    claims: [{
      id: 'default2',
      type: 'email',
      value: ''
    }],
  },
  {
    displayName: 'Phone',
    claims: [{
      id: 'default3',
      type: 'phone',
      value: ''
    }],
  }]
)

const initialState: ClaimsState = {
  loading: false,
  selected: {id: ''},
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
