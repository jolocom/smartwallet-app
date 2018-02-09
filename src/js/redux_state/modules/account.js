import Immutable from 'immutable'
import router from './router'
import { makeActions } from './'

export const actions = makeActions('account', {

  checkIfAccountExists: {
    expectedParams: [],
    async: true,
    creator: () => {
      return async (dispatch, getState, {backend, services}) => {
        const did = await services.storage.getItem('did')
        if (did) {
          dispatch(actions.setDID({did}))
          dispatch(router.pushRoute('/wallet'))
        }
      }
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
      return state.set('did', action.did)
    default:
      return state
  }
}
