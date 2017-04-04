import * as _ from 'lodash'
import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('identity', {
  getUserData: {
    expectedParams: []
  },
  setUserData: {
    expectedParams: ['field', 'value']
  },
  deleteUserData: {
    expectedParams: ['field']
  },
  updateUserData: {
    expectedParams: ['field', 'value']
  }
})

const initialState = Immutable.fromJS({
  username: {
    loaded: false,
    value: null
  },
  phone: {
    loaded: false,
    numbers: [{
      type: null,
      value: null,
      verified: false
    }]
  },
  email: {
    loaded: false,
    addresses: [{
      type: null,
      value: null,
      changed: false,
      verified: false
    }]
  },
  passport: {
    loaded: false,
    number: null,
    givenName: null,
    familyName: null,
    birthDate: null,
    age: null,
    gender: null,
    showAddress: null,
    streetAndNumber: null,
    city: null,
    zip: null,
    state: null,
    country: null
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.getUserData.id:
      return getState()
    case actions.setUserData.id:
      return state.set([action.field], action.value)
    case actions.deleteUserData.id:
      return state
    case actions.updateUserData.id:
      state.mergeIn([], {})
    default:
      return state
  }
}
