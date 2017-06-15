import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import {actions as idCardActions} from './id-card'
import {listOfCountries as options} from '../../../lib/list-of-countries'

const actions = module.exports = makeActions('wallet/id-card/country', {
  submit: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        const {value, type} = getState().toJS().wallet.country
        if (type === 'birthCountry') {
          dispatch(idCardActions.changeIdCardField(type, value))
        } else {
          dispatch(idCardActions.changePhysicalAddressField(type, value))
        }
        dispatch(actions.clearState())
        dispatch(router.pushRoute('/wallet/identity/id-card'))
        dispatch(actions.submit.buildAction())
      }
    }
  },
  clearState: {
    expectedParams: []
  },
  setCountryType: {
    expectedParams: ['value']
  },
  initiateCountrySelectScreen: {
    expectedParams: ['value'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.setCountryType(params))
        dispatch(router.pushRoute('/wallet/identity/country-select'))
      }
    }
  },
  setCountryValue: {
    expectedParams: ['value']
  },
  cancel: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.clearState())
        dispatch(router.pushRoute('/wallet/identity/id-card'))
        return params
      }
    }
  }
})

const initialState = module.exports.initialState = Immutable.fromJS({
  type: '',
  value: '',
  options
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
        options: options.map((e) =>
          e.toLowerCase().startsWith(action.value.toLowerCase()) ? e : null)
          .filter(n => n !== null)
      })

    case actions.clearState.id:
      return initialState

    default:
      return state
  }
}
