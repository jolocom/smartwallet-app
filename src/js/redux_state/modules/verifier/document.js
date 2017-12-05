import Immutable from 'immutable'
import { makeActions } from '../'
import router from '../router'
import * as transition from './transition'

const transitionUrl = '/verifier'

export const actions = makeActions('wallet/contact', {
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

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.chooseDocument.id:
      return state.merge({
        type: action.value
      })

    default:
      return state
  }
}
