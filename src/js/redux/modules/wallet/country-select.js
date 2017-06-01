import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import {actions as passportActions} from './passport'
import {listOfCountries as options} from '../../../lib/list-of-countries'

const actions = module.exports = makeActions('wallet/passport/country', {
  submit: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.submit.buildAction(params, () => {
          const {value, type} = getState().toJS().wallet.country
          if (type === 'birthCountry') {
            dispatch(passportActions.changePassportField(type, value))
          } else {
            dispatch(
              passportActions.changePhysicalAddressField(type, value))
          }
          dispatch(actions.clearState())
          dispatch(router.pushRoute('/wallet/identity/passport/add'))
        }))
      }
    }
  },
  clearState: {
    expectedParams: []
  },
  setType: {
    expectedParams: ['value']
  },
  initiate: {
    expectedParams: ['value'],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.submit.buildAction(params, () => {
          dispatch(actions.setType(params))
          dispatch(router.pushRoute('/wallet/identity/country-select'))
          return params
        }))
      }
    }
  },
  setValue: {
    expectedParams: ['value']
  },
  cancel: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.clearState())
        dispatch(router.pushRoute('/wallet/identity/passport/add'))
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
    case actions.setType.id:
      return initialState.merge({
        type: action.value
      })

    case actions.setValue.id:
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
