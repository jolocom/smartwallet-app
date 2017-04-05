import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/identity', {
  goToContactManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/identity/contact/edit'))
      }
    }
  },
  goToPassportManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/identity/passport/add'))
      }
    }
  },
  goToDivingLicenceManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/identity/drivers-licence/add'))
      }
    }
  },
  getIdentityInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        dispatch(actions.getIdentityInformation.buildAction(params,
        (backend) => {
          return backend.wallet.getUsernInformation({email: 'test@test.com'})
        }))
      }
    }
  }
})

const mapBackendToState = (data) => Immutable.fromJS(data).merge({loaded: true})

const initialState = Immutable.fromJS({
  loaded: false,
  webId: null,
  username: {
    verified: false,
    value: null
    },
  phone: [{
    type: null,
    value: null,
    verified: false
  }],
  email: [{
    type: null,
    value: null,
    verified: false
  }],
  passport:{
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
    country: null,
    verified: false,
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.getIdentityInformation.id_success:
      return mapBackendToState(action.result)
    case actions.getIdentityInformation.id:
      return state
    case actions.getIdentityInformation.id_fail:
      return state
    default:
      return state
  }
}
