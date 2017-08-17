import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import * as transition from './transition'

const transitionUrl = '/verifier'

const actions = module.exports = makeActions('wallet/contact', {
  chooseDocument: {
    expectedParams: ['value'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.chooseDocument.buildAction(params))
        dispatch(transition.setCurrentStep('face'))
        dispatch(router.pushRoute(transitionUrl))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  type: ''
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.chooseDocument.id:
      return state.merge({
        type: action.value
      })

    default:
      return state
  }
}
