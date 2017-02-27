/* global describe: true, it: true */
import {expect} from 'chai'
import {stub} from '../../../../test/utils'
import * as account from './account'
const reducer = account.default

describe.only('Account module reducer', function() {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@INIT').toJS()).to.deep.equal({
        username: '',
        password: '',
        userExists: false,
        emailVerifyScreen: false,
        emailVerifyCompleted: false,
        emailUpdateQueued: false,
        emailToBeInserted: '',
        webId: null,
        login: {
          username: '',
          password: '',
          userErrorMsg: '',
          pwErrorMsg: '',
          failureMsg: ''
        }
      })
    })
  })

  describe('doLogin', function() {
    it('should handle user already logged in', async () => {
      const thunk = account.doLogin({
        username: 'user',
        password: 'pass',
        updateUserEmail: true
      })
      const backend = {
        webId: {getWebId: () => 'http://person/profile/card'},
        accounts: {
          checkLogin: stub().returns(Promise.resolve(true))
          // loginAndSetup: stub().returns(
          //   Promise.resolve({webid: 'http://person/profile/card'})
          // ),
          // login: () => stub().returns(
          //   Promise.resolve({webid: 'http://person/profile/card'}
          // ))
        }
      }
      const dispatch = stub()
      await thunk(dispatch, null, backend)
      const action = dispatch.calledWithArgs[0]
      expect(action).to.deep.equal({
        password: 'pass',
        types: [
          account.doLogin.id,
          account.doLogin.id_success,
          account.doLogin.id_fail
        ],
        updateUserEmail: true,
        username: 'user',
        promise: action.promise
      })

      localStorage.setItem('jolocom.username', 'user')
      const result = await action.promise()
      expect(result).to.deep.equal({
        username: 'user',
        webId: 'http://person/profile/card'
      })

      let state = reducer(undefined, '@INIT')
      state = reducer(state, {type: account.doLogin.id, ...action})
      state = reducer(state, {
        type: account.doLogin.id_success,
        result,
        ...action
      })

      expect(state.toJS()).to.deep.equal({
        'emailToBeInserted': '',
        'emailUpdateQueued': false,
        'emailVerifyCompleted': false,
        'emailVerifyScreen': false,
        'loggingIn': false,
        'login': state.toJS().login,
        'password': '',
        'userExists': false,
        'username': 'user',
        'webId': 'http://person/profile/card'
      })
    })
  })
})
