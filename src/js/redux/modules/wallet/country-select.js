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
        const {value, type} = getState().toJS().wallet.country
        dispatch(actions.submit.buildAction(params, () => {
          if (type === 'birthCountry') {
            dispatch(passportActions.changePassportField(type, value))
          } else {
            dispatch(
              passportActions.changePhysicalAddressField('country', value))
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
  initiate: {
    expectedParams: ['type']
  },
  setValue: {
    expectedParams: ['value']
  },
  cancel: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.submit.buildAction(params, () => {
          dispatch(actions.clearState())
          dispatch(router.pushRoute('/wallet/identity/passport/add'))
        }))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  type: '',
  value: '',
  options
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.initiate.id:
      return initialState.merge({
        type: action.type
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
