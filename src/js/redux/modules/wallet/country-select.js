import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import {actions as passportActions} from './passport'
import {listOfCountries as options} from '../../../lib/list-of-countries'
import {isValidCountry} from '../../../lib/passport-util'

const actions = module.exports = makeActions('wallet/passport/country', {
  submit: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.validate())
        const {value, type, showErrors} = getState().toJS().wallet.country
        dispatch(actions.submit.buildAction(params, () => {
          if (!showErrors) {
            if (type === 'birthCountry') {
              dispatch(passportActions.changePassportField(type, value))
            } else {
              dispatch(
                passportActions.changePhysicalAddressField('country', value))
            }
            dispatch(router.pushRoute('/wallet/identity/passport/add'))
          }
        }))
      }
    }
  },
  initiate: {
    expectedParams: ['type']
  },
  setValue: {
    expectedParams: ['value']
  },
  cancel: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.initiate(''))
        let a = getState().toJS().wallet.country
        console.log('\n \n \n \n ===> ', a, ' <==== \n\n\n\n\n');
        dispatch(router.pushRoute('/wallet/identity/passport/add'))
        a = getState().toJS().wallet.country
        console.log('\n \n \n \n ===> ', a, ' <==== \n\n\n\n\n');
      }
    }
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
        value: action.value,
        options: options.map((e) =>
          e.toLowerCase().startsWith(action.value.toLowerCase()) ? e : null)
          .filter(n => n !== null)
      })

    case actions.submit.id:
      return initialState

    default:
      return state
  }
}
