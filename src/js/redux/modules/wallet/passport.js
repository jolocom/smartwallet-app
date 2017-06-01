import Immutable from 'immutable'
import moment from 'moment'
import WalletCrypto from 'smartwallet-contracts/lib/wallet-crypto'

import { makeActions } from '../'
import * as router from '../router'
import {listOfCountries as options} from '../../../lib/list-of-countries'
import {
  setPhysicalAddressField,
  checkForNonValidFields,
  submitChanges,
  genderList,
  mapBackendToState,
  changeFieldValue
} from '../../../lib/passport-util'

const actions = module.exports = makeActions('wallet/passport', {
  storePassportDetailsInBlockchain: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const buildAction = actions.storePassportDetailsInBlockchain.buildAction
        dispatch(buildAction(params, () => {
          const state = getState()
          const {passport} = state.getIn(['wallet', 'passport']).toJS()
          const hash = (new WalletCrypto()).calculateDataHash({
            number: passport.number.value,
            expirationDate: moment(passport.expirationDate.value).format(),
            givenName: passport.firstName.value,
            familyName: passport.lastName.value,
            birthDate: moment(passport.birthDate.value).format(),
            birthPlace: passport.birthPlace.value,
            birthCountry: passport.birthCountry.value
          })
          const {wallet} = services.auth.currentUser
          return wallet.addAttributeHashAndWait({
            attributeId: 'passport',
            attribute: hash,
            definitionUrl: '',
            password: '1234'
          })
        }))
      }
    }
  },
  save: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.validate())
        const {passport, showErrors} = getState().toJS().wallet.passport
        const {webId} = getState().toJS().wallet.identity
        if (!showErrors) {
          dispatch(actions.save.buildAction(params,
          () => submitChanges({backend, services, passport, webId})
          )).then(() => dispatch(router.pushRoute('/wallet/identity')))
        }
      }
    }
  },
  setShowAddress: {
    expectedParams: ['value']
  },
  setFocusedField: {
    expectedParams: ['field', 'group']
  },
  validate: {
    expectedParams: []
  },
  cancel: {
    expectedParams: [],
    creator: params => {
      return dispatch => {
        dispatch(router.pushRoute('/wallet/identity'))
      }
    }
  },
  retrievePassportInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, {services, backend}) => {
        dispatch(actions.retrievePassportInformation.buildAction(params,
          () => backend.solid.getPassportInformation()
        ))
      }
    }
  },
  goToSelectBirthCountry: {
    expectedParams: ['field'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/passport/select-birth-country'))
      }
    }
  },
  goToSelectCountry: {
    expectedParams: ['field'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/passport/select-country'))
      }
    }
  },
  changePassportField: {
    expectedParams: ['field', 'value']
  },
  setFoccusedGroup: {
    expectedParams: ['value']
  },
  changePhysicalAddressField: {
    expectedParams: ['field', 'value']
  }
})

const initialState = module.exports.initialState = Immutable.fromJS({
  loaded: false,
  showErrors: false,
  focusedGroup: '',
  focusedField: '',
  passport: {
    locations: [{title: '', streetWithNumber: '', zip: '', city: ''}],
    number: {value: '', valid: false},
    expirationDate: {value: '', valid: false},
    firstName: {value: '', valid: false},
    lastName: {value: '', valid: false},
    gender: {value: '', valid: false, options: genderList},
    birthDate: {value: '', valid: false},
    birthPlace: {value: '', valid: false},
    birthCountry: {value: '', valid: false, options},
    showAddress: false,
    physicalAddress: {
      streetWithNumber: {value: '', valid: false},
      zip: {value: '', valid: false},
      city: {value: '', valid: false},
      state: {value: '', valid: false},
      country: {value: '', valid: false, options}
    }
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.cancel.id:
      return initialState

    case actions.changePassportField.id:
      return changeFieldValue(state, action)

    case actions.save.id:
      return state.merge({
        loaded: false,
        showErrors: false
      })

    case actions.save.id_fail:
      return state.merge({
        showErrors: true,
        loaded: true
      })

    case actions.setShowAddress.id:
      return state.mergeIn(['passport'], {
        showAddress: action.value
      })

    case actions.save.id_success:
      return state.merge({
        loaded: true,
        showErrors: false
      })

    case actions.retrievePassportInformation.id:
      return state.merge({
        loaded: false,
        showErrors: false
      })

    case actions.retrievePassportInformation.id_fail:
      return state.merge({
        loaded: true,
        showErrors: true
      })

    case actions.retrievePassportInformation.id_success:
      return mapBackendToState(state, action)

    case actions.setFocusedField.id:
      return state.merge({
        focusedField: action.field,
        focusedGroup: action.group
      })

    case actions.changePhysicalAddressField.id:
      return setPhysicalAddressField(state, action)

    case actions.validate.id:
      return checkForNonValidFields(state)

    default:
      return state
  }
}
