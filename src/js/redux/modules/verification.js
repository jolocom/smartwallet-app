import Immutable from 'immutable'
import { makeActions } from './'

export const actions = module.exports = makeActions('verification', {
  startEmailVerification: {
    expectedParams: ['email', 'pin'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.startEmailVerification.buildAction(params, (backend) => {
          return backend.verification.startVerifyingEmail({
            wallet: services.auth.currentUser.wallet,
            email: params.email,
            pin: params.pin
          })
        }))
      }
    }
  },
  startPhoneVerification: {
    expectedParams: ['phone', 'pin'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.startPhoneVerification.buildAction(params, (backend) => {
          return backend.verification.startVerifyingPhone({
            wallet: services.auth.currentUser.wallet,
            phone: params.phone,
            pin: params.pin
          })
        }))
      }
    }
  },

  confirmEmail: {
    expectedParams: ['email', 'code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        if (!params || !params.email || !params.code) {
          let action = {
            type: actions.confirmEmail.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirmEmail.buildAction(params, (backend) => {
          return backend.verification.verifyEmail({
            contractID: services.auth.currentUser.wallet.getIdentityAddress(),
            email: params.email,
            code: params.code
          })
        }))
      }
    }
  },
  confirmPhone: {
    expectedParams: ['phone', 'code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        if (!params || !params.phone || !params.code) {
          let action = {
            type: actions.confirmPhone.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirmEmail.buildAction(params, (backend) => {
          return backend.verification.verifyEmail({
            contractID: services.auth.currentUser.wallet.getIdentityAddress(),
            phone: params.phone,
            code: params.code
          })
        }))
      }
    }
  }
})
const confirmSuccess = (state) => Immutable.fromJS(state).merge({
  success: true,
  loading: false
})
const confirmFail = (state) => Immutable.fromJS(state).merge({
  loading: false
})
const initialState = Immutable.fromJS({
  success: false,
  loading: true
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.confirmEmail.id_success:
      return confirmSuccess(state)
    case actions.confirmEmail.id_fail:
      return confirmFail(state)
    default:
      return state
  }
}
