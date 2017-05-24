import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import {
  listOfCocosntuntries as options,
  setPhysicalAddressField,
  changeFieldValue
} from '../../../lib/passport-util'

const actions = module.exports = makeActions('wallet/passport', {
  save: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.validate())
        const {information, showErrors} = getState().toJS().wallet.contact
        const webId = getState().toJS().wallet.identity.webId
        if (!showErrors) {
          dispatch(actions.saveChanges.buildAction(params,
          () => ({backend, services, information, webId})
          )).then(() => dispatch(router.pushRoute('/wallet/identity')))
        }
      }
    }
  },
  cancel: {
    expectedParams: [],
    creator: params => {
      return dispatch => {
        dispatch(router.pushRoute('/wallet/identity'))
      }
    }
  },
  showPhysicalAddress: {
    expectedParams: ['value']
  },
  retrievePassportInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, {services, backend}) => {
        dispatch(actions.retrievePassportInformation.buildAction(params,
          () => backend.solid.getUserInformation()
        ))
      }
    }
  },
  changePassportField: {
    expectedParams: ['field', 'value']
  },
  changePhysicalAddressField: {
    expectedParams: ['field', 'value']
  }
})

const initialState = module.exports.initialState = Immutable.fromJS({
  loaded: false,
  showErrors: false,
  focussedGroup: null,
  foccusedField: null,
  passport: {
    locations: {title: '', streetWithNumber: '', zip: '', city: ''},
    number: {value: 'r', valid: false},
    expirationDate: {value: 'r', valid: false},
    firstName: {value: 'r', valid: false},
    lastName: {value: '', valid: false},
    gender: {value: '', valid: false},
    birthDate: {value: '', valid: false},
    birthPlace: {value: '', valid: false},
    birthCountry: {value: 'r', valid: false, options},
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

    case actions.save.id_success:
      return state.merge({
        loaded: true,
        showErrors: false
      })

    case actions.retrievePassportInformation.id:
      return state.merge({
        loaded: false
      })

    case actions.retrievePassportInformation.id_fail:
      return state.merge({
        loaded: true,
        showErrors: true
      })

    case actions.retrievePassportInformation.id_success:
      return state.merge({
        loaded: true,
        showErrors: false
      })

    case actions.showPhysicalAddress.id:
      return state.mergeIn(['passport'], {
        showAddress: !state.getIn(['passport', 'showAddress'])
      })

    case actions.changePhysicalAddressField.id:
      return setPhysicalAddressField(state, action)

    default:
      return state
  }
}
