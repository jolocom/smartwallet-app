import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import WebIdAgent from 'lib/agents/webid'

const actions = module.exports = makeActions('wallet/identity', {
  goToContactManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/identity/contact'))
      }
    }
  },
  changeSmsCodeValue: {
    expectedParams: ['value', 'index']
  },
  changePinValue: {
    expectedParams: ['value', 'index']
  },
  setFocusedPin: {
    expectedParams: ['value', 'index']
  },
  goToPassportManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/identity/passport/add'))
      }
    }
  },
  goToDrivingLicenceManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/identity/drivers-licence/add'))
      }
    }
  },
  goToIdentity: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/identity/'))
      }
    }
  },
  getIdCardVerifications: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.getIdCardVerifications.buildAction(params, async() => {
          let numOfVerification = await services.auth.currentUser.wallet
          .identityContract.getNumberOfVerifications({
            attributeId: 'idCard',
            identityAddress: services.auth.currentUser.wallet.identityAddress
          })
          console.log('number of Verifications: ', numOfVerification.toNumber())
          return numOfVerification.toNumber()
        }))
      }
    }
  },
  getIdentityInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.getIdentityInformation.buildAction(params, () => {
          return backend.solid.getUserInformation(new WebIdAgent().getWebId())
        })).then((result) => {
          dispatch(actions.getIdCardVerifications())
        })
      }
    }
  }
})

const mapBackendToState = ({webId, contact, passports, idCards}) =>
  Immutable.fromJS({
    loaded: true,
    error: false,
    webId,
    username: {value: webId.split('.')[0].split('://')[1]},
    contact: {
      emails: contact.email,
      phones: contact.phone
    },
    passports: passports,
    idCards: idCards
  })
const mapBackendToStateError =
({webId, username, contact, passports, idCards}) =>
  Immutable.fromJS({
    loaded: true,
    error: true,
    webId: {value: ''},
    username: {value: ''},
    contact: {
      emails: [],
      phones: []
    },
    passports: [],
    idCards: []
  })
const initialState = Immutable.fromJS({
  loaded: false,
  error: false,
  webId: '',
  username: {
    verified: false,
    value: ''
  },
  contact: {
    phones: [{
      type: '',
      number: '',
      verified: false,
      smsCode: '',
      pin: '',
      pinFocused: false
    }],
    emails: [{
      type: '',
      address: '',
      pin: '',
      verified: false
    }]
  },
  passports: [
    {
      number: '',
      givenName: '',
      familyName: '',
      birthDate: '',
      gender: '',
      showAddress: '',
      streetAndNumber: '',
      city: '',
      zip: '',
      state: '',
      country: '',
      verified: false
    }
  ]
})

const changeSmsCodeValue = (state, {index, value}) => {
  if (/^[0-9]{0,6}$/.test(value)) {
    return state.mergeIn(['contact', 'phones', index], {
      smsCode: value
    })
  }
  return state
}

const changePinValue = (state, {index, value}) => {
  if (/^[0-9]{0,6}$/.test(value)) {
    return state.mergeIn(['contact', 'phones', index], {
      pin: value
    })
  }
  return state
}

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.getIdCardVerifications.id_success:
      return state.mergeIn(['idCards', '0'], {verified: action.result > 0})

    case actions.getIdentityInformation.id_success:
      return mapBackendToState(action.result)

    case actions.getIdentityInformation.id_fail:
      return mapBackendToStateError(state)

    case actions.changeSmsCodeValue.id:
      return changeSmsCodeValue(state, action)

    case actions.changePinValue.id:
      return changePinValue(state, action)

    case actions.setFocusedPin.id:
      return state.mergeIn(['contact', 'phones', action.index], {
        pinFocused: action.value
      })
    default:
      return state
  }
}
