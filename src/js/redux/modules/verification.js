import Immutable from 'immutable'
import { makeActions } from './'
import identityActions from './wallet/identity'
export const actions = module.exports = makeActions('verification', {
  startEmailVerification: {
    expectedParams: ['email', 'index', 'pin'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const { id, pin } = getState().toJS().wallet.identity
            .contact.emails[params.index]

        dispatch(actions.startEmailVerification.buildAction(params,
        (backend) => {
          return backend.verification.startVerifyingEmail({
            wallet: services.auth.currentUser.wallet,
            id: id,
            email: params.email,
            pin
          })
        }))
      }
    }
  },
  startPhoneVerification: {
    expectedParams: ['phone', 'index'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.startPhoneVerification.buildAction(params,
        (backend) => {
          const { pin, id } = getState().toJS().wallet.identity
            .contact.phones[params.index]
          return backend.verification.startVerifyingPhone({
            wallet: services.auth.currentUser.wallet,
            id,
            phone: params.phone,
            pin
          }).then((result) => {
            dispatch(identityActions.setSmsVerificationCodeStatus(
              'phones',
              params.index,
              true
            ))
            return result
          })
        }))
      }
    }
  },
  confirmEmail: {
    expectedParams: ['email', 'id', 'code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        if (!params || !params.email || !params.id || !params.code) {
          let action = {
            type: actions.confirmEmail.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirmEmail.buildAction(params, (backend) => {
          return backend.verification.verifyEmail({
            wallet: services.auth.currentUser.wallet,
            id: params.id,
            email: params.email,
            code: params.code
          })
        }))
      }
    }
  },
  confirmPhone: {
    expectedParams: ['index'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const { id, smsCode: code, number: phone } = getState()
          .toJS().wallet.identity.contact.phones[params]
        if (params === undefined || phone === undefined || code === undefined) {
          let action = {
            type: actions.confirmPhone.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirmEmail.buildAction(params, (backend) => {
          return backend.verification.verifyEmail({
            wallet: services.auth.currentUser.wallet,
            id,
            phone,
            code
          })
        }))
      }
    }
  },
  resendVerificationLink: {
    expectedParams: ['email', 'code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {}
    }
  },
  resendVerificationCode: {
    expectedParams: ['phone', 'code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {}
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
