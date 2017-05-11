import _ from 'lodash'
import Immutable from 'immutable'
import { action, asyncAction } from './'
import * as snackBar from './snack-bar'

export const doLogin = asyncAction('account/login', 'doLogin', {
  expectedParams: ['username', 'password', 'updateUserEmail'],
  creator: (params) => {
    return async (dispatch, _, {backend}) => {
      const webId = backend.webId.getWebId()

      // The user is already logged in.
      if (webId) {
        const accounts = backend.accounts
        const loggedIn = await accounts.checkLogin(webId)
          .then(() => true).catch(() => false)

        if (loggedIn) {
          dispatch(doLogin.buildAction(params, async () => {
            return {
              username: localStorage.getItem('jolocom.username'),
              webId
            }
          }))
        } else {
          dispatch(doLogout())
        }
      } else if (params.username && params.password) {
        dispatch(doLogin.buildAction(params, async (backend) => {
          const accounts = backend.accounts
          let promise
          if (params.updateUserEmail) {
            // init after activation only
            promise = accounts.loginAndSetup(
              params.username, params.password,
              params.updateUserEmail
            )
          } else {
            promise = accounts.login(params.username, params.password)
          }
          const account = await promise

          _saveAuthInfo(_saveToLocalStorage, params.username, account.webid)

          return {username: params.username, webId: account.webid}
        }))
      }
    }
  }
})
export const doSignup = action('account', 'doSignup', {
  expectedParams: ['username', 'password', 'email', 'name'],
  creator: ({username, password, email, name}) => {
    return async (dispatch, _, {backend}) => {
      localStorage.setItem('jolocom.auth-mode', 'proxy')

      const accounts = backend.accounts
      try {
        await accounts.register(username, password, email, name)
        dispatch(showEmailVerifyScreen())
      } catch (e) {
        if (e.message) {
          dispatch(snackBar.showMessage({message: e.message}))
        } else {
          dispatch(snackBar.showMessage({
            message: 'An account error has occured.'
          }))
        }
      }
    }
  }
})
export const doLogout = action('account', 'doLogout', {
  expectedParams: [],
  creator: params => {
    return (dispatch, _, {backend}) => {
      const authMode = localStorage.getItem('jolocom.auth-mode')

      const accounts = backend.accounts
      if (authMode === 'proxy') {
        accounts.logout()
      }

      localStorage.removeItem('jolocom.username')
      localStorage.removeItem('jolocom.webId')
      localStorage.removeItem('jolocom.auth-mode')

      dispatch(doLogout.buildAction(params))
    }
  }
})
export const doForgotPassword = asyncAction(
  'account', 'doForgotPassword',
  {
    expectedParams: ['username'],
    creator: params => {
      return (dispatch, _, {backend}) => {
        const accounts = backend.accounts
        return doForgotPassword.buildAction(
          params,
          accounts.forgotPassword(params.username)
            .then(() => dispatch(snackBar.showMessage({
              message: 'An email was sent to you with further instructions.'
            })))
            .catch(e => {
              dispatch(snackBar.showMessage({
                message: 'An error occured : ' + e
              }))
              throw e
            })
        )
      }
    }
  }
)
export const doResetPassword = asyncAction(
  'account', 'doResetPassword',
  {
    expectedParams: ['username', 'token', 'password'],
    creator: params => {
      return (dispatch, _, {backend}) => {
        const accounts = backend.accounts
        return doResetPassword.buildAction(
          params,
          accounts.resetPassword(params.username, params.token, params.password)
            .then(() => dispatch(snackBar.showMessage({
              message: 'You can now log in with your new password.'
            })))
            .catch(e => {
              dispatch(snackBar.showMessage({
                message: 'An error occured : ' + e
              }))
              throw e
            })
        )
      }
    }
  }
)
export const doActivateEmail = asyncAction(
  'account', 'doActivateEmail',
  {
    expectedParams: ['username', 'code'],
    creator: params => {
      return (dispatch, _, {backend}) => {
        const accounts = backend.accounts
        dispatch(doActivateEmail.buildAction(params,
          () => accounts.verifyEmail(params.username, params.code)
            .then((data) => {
              dispatch(snackBar.showMessage({
                message: 'Your account has been activated!'
              }))
              return data
            })
            .catch(e => {
              dispatch(snackBar.showMessage({
                message: 'Account activation failed.'
              }))
              throw e
            })
        ))
      }
    }
  }
)
export const doUpdateUserEmail = action(
  'account', 'doUpdateUserEmail',
  {
    expectedParams: ['email', 'webId', 'username'],
    creator: params => {
      return async (dispatch, _, {backend}) => {
        const accounts = backend.accounts
        await accounts.updateEmail(params.webId, params.email)

        _saveAuthInfo(_saveToLocalStorage, params.username, params.webId)
        dispatch({type: doLogin.id_success, result: {
          username: params.username,
          webId: params.webId
        }})
      }
    }
  }
)

export const showEmailVerifyScreen = action(
  'account/login', 'showEmailVerifyScreen',
  {expectedParams: []}
)
export const setUsername = action('account/login', 'setUsername', {
  expectedParams: ['username']
})
export const setPassword = action('account/login', 'setPassword', {
  expectedParams: ['password']
})
export const setWebId = action('account/login', 'setWebId',
  {expectedParams: ['value']}
)

const initialState = Immutable.fromJS({
  username: '',
  password: '',
  userExists: false,
  loggingIn: false,
  emailVerifyScreen: false,
  emailVerifyCompleted: false,
  emailUpdateQueued: false,
  emailToBeInserted: '',
  webId: null
})

export default function reducer(state = initialState, action = {}) {
  state = state.set('login', loginReducer(state.get('login'), action))
  // state = state.set('login', true)

  switch (action.type) {
    case setWebId.id:
      return state.merge({
        webId: action.value
      })
    case doLogin.id:
      return state.merge({loggingIn: true})
    case doLogin.id_success:
      return state.merge({
        loggingIn: false,
        username: action.result.username,
        webId: action.result.webId
      })
    case doLogout.id:
      return state.merge({
        loggingIn: false,
        username: '',
        webId: null
      })
    case doActivateEmail.id_success:
      return state.merge({
        emailUpdateQueued: true,
        emailToBeInserted: action.result.email,
        emailVerifyCompleted: true
      })
    case showEmailVerifyScreen.id:
      return state.merge({emailVerifyScreen: true})
    default:
      return state
  }
}

export function _saveToLocalStorage(data) {
  _.forEach(data, (v, k) => {
    localStorage.setItem(k, v)
  })
}

export function _saveAuthInfo(save, username, webId) {
  save({
    'jolocom.auth-mode': 'proxy',
    'jolocom.username': username,
    'jolocom.webId': webId
  })
}

// Login

export const setLoginUsername = action('account/login', 'setUsername', {
  expectedParams: ['username']
})
export const setLoginPassword = action('account/login', 'setPassword', {
  expectedParams: ['password']
})
export const setLoginErrorMessage = action('account/login', 'setErrorMessage', {
  expectedParams: ['field', 'message']
})
export const validateForm = action('account/login', 'validateForm', {
  creator: (params) => {
    return dispatch => {
      if (!params.username || !params.password) {
        if (!params.username) {
          dispatch(setLoginErrorMessage({
            field: 'user',
            message: 'Please enter a username'
          }))
        }
        if (!params.password) {
          dispatch(setLoginErrorMessage({
            field: 'pw',
            message: 'Please enter a password'
          }))
        }
      }
    }
  }
})

const initialLoginState = Immutable.fromJS({
  username: '',
  password: '',
  userErrorMsg: '',
  pwErrorMsg: '',
  failureMsg: ''
})

export function loginReducer(state = initialLoginState, action = {}) {
  switch (action.type) {
    case doLogin.id:
      return state.merge({
        failureMsg: ''
      })
    case doLogin.id_fail:
      return state.merge({
        failureMsg: 'Failed to log in'
      })
    case doLogin.id_success:
      return initialLoginState
    case setLoginUsername.id:
      return state.merge({
        userErrorMsg: '',
        username: action.username
      })
    case setLoginPassword.id:
      return state.merge({
        pwErrorMsg: '',
        password: action.password
      })
    case setLoginErrorMessage.id:
      return state.merge({
        [action.field + 'ErrorMsg']: action.message
      })
    default:
      return state
  }
}
