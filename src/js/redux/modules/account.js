import _ from 'lodash'
import Immutable from 'immutable'
import AccountsAgent from 'lib/agents/accounts'
import WebIDAgent from 'lib/agents/webid'
import { action, asyncAction } from './'
import { showMessage } from './snack-bar'

export const doLogin = asyncAction('account/login', 'doLogin', {
  expectedParams: ['username', 'password', 'updateUserEmail'],
  creator: (params) => {
    const wia = new WebIDAgent()
    const webId = wia.getWebId()

    // The user is already logged in.
    if (webId) {
      return doLogin.buildAction(params, async () => {
        const accounts = new AccountsAgent()
        const loggedIn = await accounts.checkLogin(webId)
          .then(() => true).catch(() => false)
        if (loggedIn) {
          return {
            username: localStorage.getItem('jolocom.username'),
            webId
          }
        } else {
          // TODO: session expired, log ourt
        }
      })
    } else if (params.username && params.password) {
      return doLogin.buildAction(params, async () => {
        const accounts = new AccountsAgent()
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

        _saveAuthInfo(_saveToLocalStorage, params.username, account.webId)

        return {username: params.username, webId: account.webId}
      })
    } else {
      return dispatch => {} // Do nothing
    }
  }
})
export const doSignup = action('account', 'doSignup', {
  expectedParams: ['username', 'password', 'email', 'name'],
  creator: ({username, password, email, name}) => {
    return dispatch => {
      localStorage.setItem('jolocom.auth-mode', 'proxy')

      this.accounts.register(
        username, password, email, name
      ).then((account) => {
        dispatch(showEmailVerifyScreen())
      }).catch((e) => {
        if (e.message) {
          dispatch(showMessage(e.message))
        } else {
          dispatch(showMessage('An account error has occured.'))
        }
      })
    }
  }
})
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

const initialState = Immutable.fromJS({
  username: '',
  password: '',
  userExists: false,
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
    case doLogin.id:
      return state.merge({loggingIn: true})
    case doLogin.id_success:
      return state.merge({
        loggingIn: false,
        username: action.result.username,
        webId: action.result.webId
      })
    case doLogin.id_fail:
      return state.merge({
        failureMsg: 'Failed to log in'
      })
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
    case showEmailVerifyScreen.id:
      return state.merge({emailVerifyScreen: true})
    default:
      return state
  }
}
