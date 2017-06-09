import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const dataCheckUrl = '/verification/data'
const faceCheckUrl = '/verification/face'
const resultUrl = 'verification/result'

const actions = module.exports = makeActions('wallet/contact', {
  setCurrentStep: {
    expectedParams: ['value']
  },
  startDataCheck: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute(dataCheckUrl))
      }
    }
  },
  startFaceCheck: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute(faceCheckUrl))
      }
    }
  },
  requestVerification: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        // dispatch(requestVerification())
        dispatch(router.pushRoute(resultUrl))
        dispatch(actions.requestVerification.buildAction(params))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  currentStep: 'face'
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.setCurrentStep.id:
      return state.merge({
        currentStep: action.value
      })

    default:
      return state
  }
}
