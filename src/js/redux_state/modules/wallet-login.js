import Immutable from 'immutable'
import { makeActions } from './'
import * as router from './router'
import * as snackBar from './snack-bar'
import * as settings from 'settings'

const actions = module.exports = makeActions('wallet-login', {
  setUserType: {
    expectedParams: ['value'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.setUserType.buildAction(params))

        const {userType} = getState().get('walletLogin').toJS()

        if (!userType.valid) {
          throw new Error('Invalid user type: ' + userType.value)
        }

        let route = '/login/layman'
        if (userType.value === 'expert') {
          route = '/login/expert'
        }

        return dispatch(router.pushRoute(route))
      }
    }
  },
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
            if (settings.verifier) {          
              dispatch(router.pushRoute('verifier/document'))
            } else if (state.callbackURL.length > 1) {       
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
        dispatch(router.pushRoute('/login'))
      }
    }
  },
  setUsername: {
    expectedParams: ['value']
  },
  setPassword: {
    expectedParams: ['value']
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
  submitLogin: {
    expectedParams: ['username, password'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const state = getState().get('walletLogin').toJS()
        dispatch(actions.submitLogin.buildAction(params, (backend) => {
          return backend.wallet
            .retrieveSeedPhrase({
              email: state.login.username,
              password: state.login.password
            })
            .then((seed) => {
              dispatch(actions.setPassphrase(seed))
              dispatch(actions.goForward())
            })
            .catch((e) => {
              dispatch(snackBar.showMessage({
                message: 'Invalid username or password'
              }))
            })
        }))
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
  userType: {
    value: '',
    valid: false
  },
  passphrase: {
    value: '',
    failed: false,
    valid: false,
    errorMsg: '',
    hasOwnURL: false,
    valueOwnURL: ''
  },

  login: {
    username: '',
    password: '',
    failed: false,
    valid: false,
    errorMsg: ''
  },
  callbackURL: ''
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.setUserType.id:
      const valid = ['expert', 'layman'].indexOf(action.value) !== -1

      if (action.value && !valid) {
        throw Error('Invalid user type: ' + action.value)
      }

      return state.mergeDeep({
        userType: {
          value: action.value,
          valid
        }
      })

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
          login : {
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
        },
        login: {
          errorMsg: '',
          failed: false,
          valid: true
        }
      })
    case actions.setUsername.id:
      return state.mergeDeep({
        login: {
          username: action.value
        }
      })
    case actions.setPassword.id:
      return state.mergeDeep({
        login: {
          password: action.value
        }
      })
    case actions.submitLogin.id_fail:
      return state.mergeDeep({
        login: {
          errorMsg: 'Incorrect username or password',
          failed: true,
          valid: false
        },
        pin: {
          errorMsg: 'ERROR ggg'
        }
      })
    case actions.submitLogin.id_success:
      return state.mergeDeep({
        login: {
          username: '',
          password: '',
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
