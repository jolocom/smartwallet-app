import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import {actions as passportActions} from './passport'
import {listOfCountries as options} from '../../../lib/list-of-countries'
import {isValidCountry} from '../../../lib/passport-util'

const actions = module.exports = makeActions('wallet/passport', {
  submit: {
    expectedParams: [],
    creator: params => {
      return (dispatch, getState) => {
        dispatch(actions.validate())
        const {value, type, showErrors} = getState().toJS() // eslint-disable-line
        if (!showErrors) {
          if (type === 'birthCountry') {
            dispatch(passportActions.setPassportField(type, value))
          } else {
            dispatch(passportActions.setPhysicalAddressField(type, value))
          }
          dispatch(router.pushRoute('/wallet/identity/passport/add'))
          dispatch(actions.submit.buildAction(params))
        }
      }
    }
  },
  initiate: {
    expectedParams: ['type']
  },
  setValue: {
    expectedParams: ['field', 'value']
  },
  validate: {
    expectedParams: []
  }
})

const initialState = Immutable.fromJS({
  showErrors: false,
  type: '',
  value: '',
  options
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.initiate.id:
      return state.merge({
        type: action.type
      })

    case actions.validate.id:
      return state.merge({
        showErrors: !isValidCountry(state.get('value'))
      })

    case actions.setValue.id:
      return state.merge({
        value: action.value
      })

    case actions.submit.id:
      return initialState

    default:
      return state
  }
}
