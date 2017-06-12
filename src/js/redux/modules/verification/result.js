import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const verificationStartUrl = '/verification'
const dataCheckUrl = 'verification/data'
const actions = module.exports = makeActions('wallet/contact', {
  finishVerification: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(actions.finishVerification.buildAction(params))
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
        dispatch(router.pushRoute(dataCheckUrl))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  loading: true,
  success: false,
  numberOfFails: 0
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
