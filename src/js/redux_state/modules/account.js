import { makeActions } from './'
import Immutable from 'immutable'

export const actions = makeActions('account', {
  checkIfAccountExists: {
    expectedParams: [],
    creator: () => {
    }
  },

  setDID: {
    expectedParams: ['did']
  }
})

const initialState = Immutable.fromJS({
  did: ''
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.setDID.id:
      return
    default:
      return state
  }
}
