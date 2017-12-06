import Immutable from 'immutable'
import { makeActions } from '../'
import router from '../router'

import { actions as transition } from './transition'
const transitionUrl = '/verifier'

export const actions = makeActions('wallet/contact', {
  verifyFace: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        const {isFaceMatchingId} = getState().toJS().verifier.face
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

export default (state = initialState, action = {}) => {
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
