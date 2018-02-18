import Immutable from 'immutable'
import { makeActions } from './'
import { actions as identityActions } from './wallet/identity-new'
import router from './router'

export const actions = makeActions('verification', {
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
    expectedParams: ['phone'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.startPhoneVerification.buildAction(params,
        async (backend) => {
          const phoneClaim = await services.storage.getItem('phone')
          const phoneData = getState().toJS().wallet.identityNew.userData.phone
            dispatch(identityActions.setSmsVerificationCodeStatus(
              {field: 'phone',
               value: true}
            ))
          console.log({claim: phoneClaim})
          return backend.verification.startVerifyingPhone(phoneClaim
          )
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
      return (dispatch, getState, {services}) => {
        const data = getState()
          .toJS().wallet.identityNew.userData.phone
        console.log(data)
        const id =  'phone'
        const code = data.smsCode
        const phone =  data.value
        if ([phone, code].includes(undefined)) {
          let action = {
            type: actions.confirmPhone.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirmPhone.buildAction('0', (backend) => {
          return backend.verification.verifyPhone({
            did: getState().toJS().wallet,
            type: id,
            phone,
            id,
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
