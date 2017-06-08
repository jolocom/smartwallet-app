import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/contact', {})

const initialState = Immutable.fromJS({})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    default:
      return state
  }
}
