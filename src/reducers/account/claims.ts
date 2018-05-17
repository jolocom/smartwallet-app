import { AnyAction } from 'redux'
import { Map } from 'immutable'

const initialState = Map({
  loading: false,
  savedClaims: {
    claimCategories: ['personal', 'contact'],
    personal: [{
      claimType: 'name',
      category: 'personal'
    }],
    contact: [{
      claimType: 'email',
      category: 'contact'
    }]
  }
})

export const claims = (state = initialState, action: AnyAction): any => {

  switch (action.type) {

    case 'SET_LOADING':
      const newState = state.setIn(['loading'], action.loading)
      return newState

    case 'GET_CLAIMS_DID':
      return state.setIn(['savedClaims'], action.claims).setIn(['loading'], false)

    default:
      return state
  }

}
