import Immutable from 'immutable'

import {listOfCountries as __LIST_OF_COUNTRIES__} from '../../../lib/list-of-countries' // eslint-disable-line max-len
import {
  setPhysicalAddressField,
  genderList,
  changeFieldValue
} from '../../../lib/id-card-util'

import { makeActions } from '../'
import * as router from '../router'
import * as transition from './transition'

const transitionUrl = '/verification'

const actions = module.exports = makeActions('verification/data', {
  verifyData: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(transition.setCurrentStep('compare'))
        dispatch(router.pushRoute(transitionUrl))
        dispatch(actions.verifyData.buildAction(params))
      }
    }
  },
  setShowAddress: {
    expectedParams: ['value']
  },
  setFocusedField: {
    expectedParams: ['field', 'group']
  },
  cancel: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(actions.cancel.buildAction(params))
        dispatch(transition.setCurrentStep('face'))
        dispatch(router.pushRoute(transitionUrl))
      }
    }
  },
  changeIdCardField: {
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
  focusedGroup: '',
  focusedField: '',
  idCard: {
    number: {value: '', valid: false},
    expirationDate: {value: '', valid: false},
    firstName: {value: '', valid: false},
    lastName: {value: '', valid: false},
    gender: {value: '', valid: false, options: genderList},
    birthDate: {value: '', valid: false},
    birthPlace: {value: '', valid: false},
    birthCountry: {value: '', valid: false, options: __LIST_OF_COUNTRIES__},
    showAddress: false,
    physicalAddress: {
      streetWithNumber: {value: '', valid: false},
      zip: {value: '', valid: false},
      city: {value: '', valid: false},
      state: {value: '', valid: false},
      country: {value: '', valid: false, options: __LIST_OF_COUNTRIES__}
    }
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.cancel.id:
      return initialState

    case actions.changeIdCardField.id:
      return changeFieldValue(state, action)

    case actions.changePhysicalAddressField.id:
      return setPhysicalAddressField(state, action)

    case actions.setShowAddress.id:
      return state.mergeIn(['idCard'], {
        showAddress: action.value
      })

    case actions.setFocusedField.id:
      return state.merge({
        focusedField: action.field,
        focusedGroup: action.group
      })

    default:
      return state
  }
}
