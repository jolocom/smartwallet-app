import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import * as transition from './transition'

const verificationStartUrl = '/verification'
const dataCheckUrl = 'verification/data'
const actions = module.exports = makeActions('wallet/contact', {
  finishVerification: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(actions.finishVerification.buildAction(params))
        dispatch(transition.setCurrentStep('face'))
        dispatch(router.pushRoute(verificationStartUrl))
      }
    }
  },
  startComparingData: {
    async: true,
    expectedParams: ['data']
  },
  startDataCheck: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        console.log('=========== data check ========  ')
        dispatch(transition.setCurrentStep('data'))
        dispatch(router.pushRoute(dataCheckUrl))
        dispatch(actions.startDataCheck.buildAction(params))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  loading: false,
  success: true,
  numberOfFails: 1
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.startComparingData.id:
      return state.merge({
        loading: true
      })
    case actions.startComparingData.id_success:
      return state.merge({
        loading: false,
        success: true,
        numberOfFails: 0
      })
    case actions.startComparingData.id_fail:
      return state.merge({
        loading: false,
        success: false,
        numberOfFails: state.get('numberOfFails') + 1
      })
    default:
      return state
  }
}
