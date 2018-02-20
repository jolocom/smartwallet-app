import Immutable from 'immutable'
import { makeActions } from './'
import { actions as identityActions } from './wallet/identity-new'
import router from './router'

export const actions = makeActions('verification', {
  startEmailVerification: {
    expectedParams: ['email'],
    async: true,
    creator: (params) => {
      return async (dispatch, getState, {backend, services}) => {
        dispatch(actions.startEmailVerification.buildAction(params,
        async (backend) => {
          const emailClaimId = await services.storage.getItem('email')
          const claim = await services.storage.getItem(emailClaimId.claims[0].id)
          dispatch(identityActions.setSmsVerificationCodeStatus({
            field: 'email',
            value: true
          }))
          return backend.verification.startVerifyingEmail(claim)
      }))
    }}
  },

  startPhoneVerification: {
    expectedParams: ['phone'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.startPhoneVerification.buildAction(params, async (lel) => {
          const phoneClaimId = await services.storage.getItem('phone')
          const claim = await services.storage.getItem(phoneClaimId.claims[0].id)
          const phoneData = getState().toJS().wallet.identityNew.userData.phone
          dispatch(identityActions.setSmsVerificationCodeStatus({
            field: 'phone',
            value: true
          }))
          return backend.verification.startVerifyingPhone(claim)
        }))
      }
    }
  },

  confirmEmail: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return async (dispatch, getState, {services}) => {
        const data = getState().toJS().wallet.identityNew.userData.email
        const id =  'email'
        const code = data.smsCode
        const email =  data.value
        const did = await services.storage.getItem('did')
        if (!email || !did || !code) {
          let action = {
            type: actions.confirmEmail.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirmEmail.buildAction(params, (backend) => {
          return backend.verification.verifyEmail({
            did,
            code
          }).then(async (res) => {
            if(res.credential) {
              const emailData = await services.storage.getItem('email')
              emailData.claims.push({id: res.credential.id, issuer: res.credential.issuer})
              await services.storage.setItem(res.credential.id, res)
              await services.storage.setItem('email', emailData)
              return dispatch(identityActions.enterField({
                attrType: 'email',
                field: 'verified',
                value: true
              }))
            } else {
              return res
            }
          })
        }))
      }
    }
  },
  goToAfterConfirmEmail: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const user = services.auth.currentUser
        if (user == null || user.wallet.seedPhrase === undefined) {
          dispatch(router.pushRoute('/'))
        } else {
          dispatch(router.pushRoute('/wallet/identity'))
        }
      }
    }
  },
  confirmPhone: {
    expectedParams: [],
    async: true,
    creator: () => {
      return async (dispatch, getState, {services}) => {
        const data = getState().toJS().wallet.identityNew.userData.phone
        const id =  'phone'
        const code = data.smsCode
        const phone =  data.value
        const did = await services.storage.getItem('did')
        if ([phone, code].includes(undefined)) {
          let action = {
            type: actions.confirmPhone.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirmPhone.buildAction('0', async (backend) => {
          return backend.verification.verifyPhone({
            did,
            code
          }).then(async (res) => {
            if(res.credential) {
              const phoneData = await services.storage.getItem('phone')
              phoneData.claims.push({id: res.credential.id, issuer: res.credential.issuer})
              await services.storage.setItem(res.credential.id, res)
              await services.storage.setItem('phone', phoneData)
              return dispatch(identityActions.enterField({
                attrType: 'phone',
                field: 'verified',
                value: true
              }))
            } else {
              return res
            }
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
  },
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

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.confirmEmail.id_success:
      return confirmSuccess(state)

    case actions.confirmEmail.id_fail:
      return confirmFail(state)

    default:
      return state
  }
}
