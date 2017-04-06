import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/identity', {
  goToContactManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/identity/contact'))
      }
    }
  },
  goToPassportManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/identity/passport'))
      }
    }
  },
  goToDivingLicenceManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/identity/drivers-licence'))
      }
    }
  },
  getIdentityInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.getIdentityInformation.buildAction(params,
        () => {
          return services.auth.currentUser.wallet.getUserInformation({email: 'test@test.com'})
        }))
      }
    }
  }
})

const mapBackendToState = (data) => Immutable.fromJS(data).merge({loaded: true})

const initialState = Immutable.fromJS({
  loaded: false,
  webId: '',
  username: {
    verified: false,
    value: ''
    },
  contact: {
    phone: [{
      type: '',
      value: '',
      verified: false
    }],
    email: [{
      type: '',
      value: '',
      verified: false
    }]
  },
  passport:{
    number: '',
    givenName: '',
    familyName: '',
    birthDate: '',
    age: '',
    gender: '',
    showAddress: '',
    streetAndNumber: '',
    city: '',
    zip: '',
    state: '',
    country: '',
    verified: false
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
