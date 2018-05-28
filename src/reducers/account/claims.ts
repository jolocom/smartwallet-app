import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { ClaimsState } from 'src/reducers/account'

const initialState: ClaimsState = ({
  loading: false,
  selected: {id: '', claimField: ''},
  savedClaims: {
    personal: [{
      claimField: 'name',
      category: 'personal'
    }],
    contact: [{
      claimField: 'email',
      category: 'contact'
    }]
  }
})

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
