import * as _ from 'lodash'
import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/contact', {
  saveChanges: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/identity'))
      }
    }
  }
})

const initialState = Immutable.fromJS({
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    // case actions.saveChanges.id

    default:
      return state
  }
}
