import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

import * as transition from './transition'
const transitionUrl = '/verification'

const actions = module.exports = makeActions('wallet/contact', {
  verifyFace: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        const {isFaceMatchingId} = getState().toJS().verification.face
        if (isFaceMatchingId) {
          dispatch(transition.setCurrentStep('data'))
          dispatch(router.pushRoute(transitionUrl))
        }
        dispatch(actions.verifyFace.buildAction(params))
      }
    }
  },
  cancelFaceVerification: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.cancelFaceVerification.buildAction(params))
        dispatch(router.pushRoute(transitionUrl))
      }
    }
  },
  confirmFaceIdCardMatch: {
    expectedParams: []
  }
})

const initialState = Immutable.fromJS({
  isFaceMatchingId: false
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.cancelFaceVerification.id:
      return initialState

    case actions.confirmFaceIdCardMatch.id:
      return state.merge({
        isFaceMatchingId: !state.get('isFaceMatchingId')
      })

    default:
      return state
  }
}
