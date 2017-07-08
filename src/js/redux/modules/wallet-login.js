import Immutable from 'immutable'
import { makeActions } from './'
import * as router from './router'
import * as snackBar from './snack-bar'

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
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.submitPassphrase.buildAction(params, (backend) => {
          dispatch(
            router.pushRoute('/login/pin-entry')
          )
        }))
      }
    }
  },
  setPin: {
    expectedParams: ['value']
  },
  setPinFocused: {
    expectedParams: ['value']
  },
  resetPin: {
    expectedParams: []
  },
  goForward: {
    expectedParams: ['value'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        const state = getState().get('walletLogin').toJS()
        dispatch(actions.goForward.buildAction(params, () => {
          return services.auth
            .loginWithSeedPhrase({
              seedPhrase: state.passphrase.value,
              pin: state.pin.value
            })
            .then(({wallet}) => {
              console.log(wallet)
              let webid = wallet.webId
              console.log('webid : ', webid)
              let username =
                /^https:\/\/(([^.]*).)?([^.]*.[^.]*(.([^.]*))?)$/.exec(webid)[2]
              console.log('username : ', username)
              let password = state.passphrase.value
              let privatekey = wallet.webIDPrivateKey
              return backend.accounts.solidLogin(username, password, privatekey)
            }).then(() => dispatch(router.pushRoute('/verification/document')))
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
  submitLogin: {
    expectedParams: ['username, password'],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        const state = getState().get('walletLogin').toJS()
        dispatch(actions.submitLogin.buildAction(params, (backend) => {
          return backend.wallet
            .retrieveSeedPhrase({
              email: state.login.username,
              password: state.login.password
            })
            .then(({seed}) => {
              dispatch(actions.setPassphrase(seed))
              dispatch(router.pushRoute('/login/pin-entry'))
            })
            .catch((e) => {
              dispatch(snackBar.showMessage({
                message: 'Invalid username or password'
              }))
            })
        }))
      }
    }
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
    errorMsg: ''
  },
  pin: {
    value: '',
    focused: false,
    failed: false,
    valid: false,
    errorMsg: ''
  },
  login: {
    username: '',
    password: '',
    failed: false,
    valid: false,
    errorMsg: ''
  }
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

    case actions.submitPassphrase.id_success:
      return state.mergeDeep({
        passphrase: {
          errorMsg: '',
          valid: true,
          failed: false
        }
      })

    case actions.submitPassphrase.id_fail:
      return state.mergeDeep({
        passphrase: {
          errorMsg: 'Your passphrase is not correct',
          valid: false,
          failed: true
        }
      })

    case actions.setPin.id:
      if (!(/^[0-9]{0,4}$/).test(action.value)) {
        return state
      }
      return state.mergeDeep({
        pin: {
          value: action.value,
          valid: action.value.length === 4
        }
      })

    case actions.setPinFocused.id:
      return state.mergeDeep({
        pin: {
          focused: action.value
        }
      })

    case actions.resetPin.id:
      return state.mergeDeep({
        pin: {
          value: '',
          valid: false,
          failed: false
        }
      })
    case actions.goForward.id_fail:
      return state.mergeDeep({
        pin: {
          errorMsg: 'Your Pin is Not correct!',
          failed: true,
          valid: false
        }
      })
    case actions.goForward.id_success:
      return state.mergeDeep({
        pin: {
          errorMsg: '',
          failed: false,
          valid: true
        },
        passphrase: {
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

    default:
      return state
  }
}
