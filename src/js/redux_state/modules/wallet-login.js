import Immutable from 'immutable'
import { makeActions } from './'
import * as router from './router'

export const actions = makeActions('wallet-login', {
  setPassphrase: {
    expectedParams: ['value']
  },
  resetPassphrase: {
    expectedParams: []
  },
  submitPassphrase: {
    expectedParams: ['value'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(
          actions.goForward()
        )
      }
    }
  },
  goForward: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const state = getState().get('walletLogin').toJS()
        dispatch(actions.goForward.buildAction(params, (backend) => {
          return services.auth.login({
            seedPhrase: state.passphrase.value,
            gatewayUrl: state.passphrase.valueOwnURL
          }).then(() => {
            // if (IS_VERIFIER) {
            //   dispatch(router.pushRoute('verifier/document'))
            // }
            if (state.callbackURL.length > 1) {
              dispatch(router.pushRoute(state.callbackURL))
              dispatch(actions.clearCallbackUrl())
            } else {
              dispatch(router.pushRoute('/wallet/identity'))
            }
          })
        }))
      }
    }
  },
  goToLogin: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/'))
      }
    }
  },
  setValueOwnURL: {
    expectedParams: ['value']
  },
  toggleHasOwnURL: {
    expectedParams: ['value'],
    creator: (params) => {
      return (dispatch) => {
        dispatch(actions.toggleHasOwnURL.buildAction(params))
      }
    }
  },
  storeCallbackUrl: {
    expectedParams: ['callbackURL'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.storeCallbackUrl.buildAction(params))
      }
    }
  },
  clearCallbackUrl: {
    expectedParams: []
  }
})

const initialState = Immutable.fromJS({
  passphrase: {
    value: '',
    failed: false,
    valid: false,
    errorMsg: '',
    hasOwnURL: false,
    valueOwnURL: ''
  },
  login: {
    errorMsg: null,
    failed: false,
    valid: false
  },
  callbackURL: ''
})

export default (state = initialState, action = {}) => {
  switch (action.type) {

    case actions.setPassphrase.id:
      return state.mergeDeep({
        passphrase: {
          value: action.value,
          valid: action.value.length > 0
        }
      })

    case actions.resetPassphrase.id:
      return state.mergeDeep({
        passphrase: {
          value: '',
          valid: false,
          failed: false
        }
      })

    case actions.goForward.id_fail:
      if (action.error.message.indexOf('invalid seed phrase') !== -1) {
        return state.mergeDeep({
          login: {
            errorMsg: 'Please check your seedphrase. It is not correct.',
            failed: true,
            valid: false
          }
        })
      } else {
        return state.mergeDeep({
          login: {
            errorMsg: 'Address for your private space cannot be reached. Please double check.', // eslint-disable-line max-len
            failed: true,
            valid: false
          }
        })
      }

    case actions.goForward.id_success:
      return state.mergeDeep({
        login: {
          errorMsg: '',
          failed: false,
          valid: true
        }
      })

    case actions.toggleHasOwnURL.id:
      return state.mergeIn(['passphrase'], {
        hasOwnURL: action.value
      })

    case actions.setValueOwnURL.id:
      return state.mergeIn(['passphrase'], {
        valueOwnURL: action.value
      })

    case actions.storeCallbackUrl.id:
      return state.merge({
        callbackURL: action.callbackURL
      })

    case actions.clearCallbackUrl.id:
      return state.merge({
        callbackURL: ''
      })

    default:
      return state
  }
}
