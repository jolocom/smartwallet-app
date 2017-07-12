import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import {actions as idCardActions} from './id-card'
import * as contact from './contact'
import {
  listOfCountries as __LIST_OF_COUNTRIES__
} from '../../../lib/list-of-countries'


const actions = module.exports = makeActions('wallet/id-card/country', {
  submit: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        const {value, type, returnUrl, age, index} = getState()
          .toJS().wallet.country
        dispatch(actions.submit.buildAction())
        if (returnUrl.length > 0) {
          dispatch(router.pushRoute(returnUrl))
        }
        if (type === 'birthCountry') {
          dispatch(idCardActions.changeIdCardField(type, value))
        } else if (type === 'country') {
          dispatch(idCardActions.changePhysicalAddressField(type, value))
        } else {
          dispatch(contact.setAddressField(age, 'country', index, value))
        }
        dispatch(actions.clearState())
      }
    }
  },
  clearState: {
    expectedParams: []
  },
  setCountryType: {
    expectedParams: ['value']
  },
  setReturnUrl: {
    expectedParams: ['value']
  },
  initiateCountryScreenFromContactScreen: {
    expectedParams: ['age', 'index', 'value'],
    creator: (...params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/identity/country-select'))
        dispatch(actions.setReturnUrl('/wallet/identity/contact'))
        dispatch(contact.setReloadFromBackend(false))
        dispatch(
          actions.initiateCountryScreenFromContactScreen.buildAction(...params))
      }
    }
  },
  initiateCountrySelectScreen: {
    expectedParams: ['value'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.setCountryType(params))
        dispatch(actions.setReturnUrl('/wallet/identity/id-card'))
        dispatch(router.pushRoute('/wallet/identity/country-select'))
      }
    }
  },
  setCountryValue: {
    expectedParams: ['value']
  },
  saveCountryToContact: {
    expectedParams: ['value'],
    creator: (params) => {
      return (dispatch, getState) => {
        const {value, type: index, age, returnUrl} = getState().toJS()
          .wallet.country
        dispatch(contact.setAddressField(age, 'country', index, value))
        dispatch(router.pushRoute(returnUrl))
        dispatch(actions.clearState())
        dispatch(actions.saveCountryToContact.buildAction(params))
      }
    }
  },
  cancel: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        const {returnUrl} = getState().toJS().wallet.country
        dispatch(router.pushRoute(returnUrl))
        dispatch(actions.clearState())
        return params
      }
    }
  }
})

const initialState = module.exports.initialState = Immutable.fromJS({
  type: '',
  value: '',
  age: '',
  returnUrl: '',
  index: '',
  options: __LIST_OF_COUNTRIES__

})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.setCountryType.id:
      return initialState.merge({
        type: action.value
      })

    case actions.setCountryValue.id:
      return state.merge({
        value: action.value,
        options: __LIST_OF_COUNTRIES__.filter((countryLabel) =>
          countryLabel.toLowerCase().startsWith(action.value.toLowerCase()))
      })

    case actions.initiateCountryScreenFromContactScreen.id:
      return state.merge({
        value: action.value,
        age: action.age,
        index: action.index
      })

    case actions.setReturnUrl.id:
      return state.merge({
        returnUrl: action.value
      })

    case actions.clearState.id:
      return initialState

    default:
      return state
  }
}
