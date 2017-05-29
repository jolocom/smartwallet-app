import Immutable from 'immutable'
import { makeActions } from './'

export const actions = module.exports = makeActions('email-confirmation', {
  startEmailConfirmation: {
    expectedParams: ['email'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.startConfirmation.buildAction(params, (backend) => {
          return backend.verification.startVerifyingEmail({
            contractID: services.auth.currentUser.wallet.getIdentityAddress(),
            email: params.email
          })
        }))
      }
    }
  },
  confirm: {
    expectedParams: ['email', 'code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        if (!params || !params.email || !params.code) {
          let action = {
            type: actions.confirm.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirm.buildAction(params, (backend) => {
          return backend.verification.verifyingEmail({
            contractID: services.auth.currentUser.wallet.getIdentityAddress(),
            email: params.email,
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
    case actions.confirm.id_success:
      return confirmSuccess(state)
    case actions.confirm.id_fail:
      return confirmFail(state)
    default:
      return state
  }
}
