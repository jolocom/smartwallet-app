import _ from 'lodash'
import { Map } from 'immutable'
import AccountsAgent from 'lib/agents/accounts'
import WebIDAgent from 'lib/agents/webid'
import { action, asyncAction } from '../'

export const doLogin = asyncAction('account/login', 'doLogin', {
  expectedParams: ['username', 'password', 'updateUserEmail'],
  creator: (params) => {
    const wia = new WebIDAgent()
    const webId = wia.getWebId()

    // The user is already logged in.
    if (webId) {
      return doLogin.buildAction(params, async () => {
        const loggedIn = await this.accounts.checkLogin(webId)
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
            this.state.emailUpdateQueued
          )
        } else {
          promise = accounts.login(params.username, params.password)
        }
        const account = await promise

        _saveAuthInfo(_saveToLocalStorage, params.username, account.webId)

        return {username: params.username, webId: account.webId}
      })
    } else {
      return dispatch => {
        if (!params.username) {
          dispatch(setErrorMessage({
            field: 'user',
            message: 'Please enter a username'
          }))
        }
        if (!params.password) {
          dispatch(setErrorMessage({
            field: 'pw',
            message: 'Please enter a password'
          }))
        }
      }
    }
  }
})
export const setUsername = action('account/login', 'setUsername', {
  expectedParams: ['username']
})
export const setPassword = action('account/login', 'setPassword', {
  expectedParams: ['password']
})
export const setErrorMessage = action('account/login', 'setErrorMessage', {
  expectedParams: ['field', 'message']
})

const initialState = new Map({
  username: '',
  password: '',
  userErrorMsg: '',
  pwErrorMsg: '',
  failureMsg: ''
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // case doLogin.id:
    //   let error = false
    //   if (state.username === '') {
    //     error = true
    //     state = state.merge({
    //       userErrorMsg: 'Please enter a username'
    //     })
    //   }
    //   if (this.state.password === '') {
    //     error = true
    //     state = state.merge({
    //       pwErrorMsg: 'Please enter a password'
    //     })
    //   }

    //   if (error) {
    //     return state
    //   }

    //   break
    case setUsername.id:
      return state.merge({
        userErrorMsg: '',
        username: action.username
      })
    case setPassword.id:
      return state.merge({
        pwErrorMsg: '',
        password: action.password
      })
    case doLogin.id:
      return state.merge({loggingIn: true})
    case doLogin.id_success:
      return state.merge({
        loggingIn: false,
        username: action.username,
        webId: action.result.webId
      })
    case doLogin.id_fail:
      return state.merge({
        failureMsg: 'Failed to log in'
      })
    case setErrorMessage.id:
      return state.merge({
        [action.field + 'ErrorMsg']: action.message
      })
    default:
      return state
  }
}

export function _saveToLocalStorage(data) {
  _.forEach(data, (k, v) => {
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
