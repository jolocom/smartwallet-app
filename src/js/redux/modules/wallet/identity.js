import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import util from 'lib/util'
// import WebIdAgent from 'lib/agents/webid'

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
  expandField: {
    expectedParams: ['field', 'value']
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
          return numOfVerification.toNumber()
        }))
      }
    }
  },
  saveToBlockchain: {
    expectedParams: ['index'],
    async: true,
    creator: (index) => {
      return (dispatch, getState, {services, backend}) => {
        const idCard = getState().toJS().wallet.identity.idCards[index]
        dispatch(actions.saveToBlockchain.buildAction(index, () => {
          return storeIdCardDetailsInBlockchain({idCard, services})
        }))
      }
    }
  },
  getIdentityInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.getIdentityInformation.buildAction(params, () =>
          services.auth.currentUser.wallet.getUserInformation()
            .then((result) => {
              dispatch(actions.getIdCardVerifications())
              return result
            })
        ))
      }
    }
  }
})

const mapBackendToState = ({webId, userName, contact, passports, idCards}) =>
  Immutable.fromJS({
    loaded: true,
    error: false,
    webId: webId,
    username: {value: userName},
    expandedFields: {
      contact: false,
      idCards: false,
      passports: false
    },
    contact: {
      emails: contact.email,
      phones: contact.phone
    },
    passports: passports,
    idCards: idCards
  })
const mapBackendToStateError =
({webId, userName, contact, passports, idCards}) =>
  Immutable.fromJS({
    loaded: true,
    error: true,
    expandedFields: {
      contact: false,
      idCards: false,
      passports: true
    },
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
  expandedFields: {
    contact: false,
    idCards: false,
    passports: false
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
  passports: [{
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
  }]
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

    case actions.saveToBlockchain.id_success:
      return state.mergeIn(['idCards', '0'], {savedToBlockchain: true})
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

    case actions.expandField.id:
      return state.setIn(['expandedFields', action.field], action.value)

    default:
      return state
  }
}

function storeIdCardDetailsInBlockchain({idCard, services}) {
  const {wallet} = services.auth.currentUser
  return wallet.addAttributeHashToIdentity(
    {
      attributeId: 'idCard',
      attribute: {
        birthCountry: idCard.idCardFields.birthCountry,
        birthDate: idCard.idCardFields.birthDate,
        birthPlace: idCard.idCardFields.birthPlace,
        expirationDate: idCard.idCardFields.expirationDate,
        firstName: idCard.idCardFields.firstName,
        gender: idCard.idCardFields.gender,
        lastName: idCard.idCardFields.lastName,
        number: idCard.idCardFields.number,
        city: idCard.idCardFields.physicalAddress.city,
        country: idCard.idCardFields.physicalAddress.country,
        state: idCard.idCardFields.physicalAddress.state,
        streetWithNumber: idCard.idCardFields.physicalAddress.streetWithNumber,
        zip: idCard.idCardFields.physicalAddress.zip
      },
      definitionUrl:
      `${util.webidRoot(wallet.webId)}/profile/idCard${idCard.id}`,
      pin: '1234',
      identityAddress: wallet.identityAddress
    }
  )
}
