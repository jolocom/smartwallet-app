import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import {actions as data} from './data'
import {
  listOfCountries as __LIST_OF_COUNTRIES__
} from '../../../lib/list-of-countries'

const dataPageUrl = '/verifier/data'
const selectCountryUrl = '/verifier/country'

const actions = module.exports = makeActions('verifier/country', {
  chooseCountry: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        const {value, type} = getState().toJS().verifier.country
        if (type === 'birthCountry') {
          dispatch(data.changeIdCardField(type, value))
        } else {
          dispatch(data.changePhysicalAddressField(type, value))
        }
        dispatch(actions.setCountryType(''))
        dispatch(router.pushRoute(dataPageUrl))
        dispatch(actions.chooseCountry.buildAction(params))
      }
    }
  },
  setCountryType: {
    expectedParams: ['value']
  },
  initiateCountrySelectScreen: {
    expectedParams: ['value'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.setCountryType(params))
        dispatch(router.pushRoute(selectCountryUrl))
      }
    }
  },
  setCountryValue: {
    expectedParams: ['value']
  },
  cancelCountrySelection: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute(dataPageUrl))
        dispatch(actions.cancelCountrySelection.buildAction(params))
      }
    }
  }
})

const initialState = module.exports.initialState = Immutable.fromJS({
  type: '',
  value: '',
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
        options: __LIST_OF_COUNTRIES__.filter((countryName) =>
          countryName.toLowerCase().startsWith(action.value.toLowerCase()))
      })

    case actions.cancelCountrySelection.id:
      return initialState

    default:
      return state
  }
}
