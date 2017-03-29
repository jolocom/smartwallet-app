import {expect} from 'chai'
import {stub} from '../../../../test/utils'
import * as snackBar from './snack-bar'
import * as account from './account'
const reducer = account.default

describe('Account module reducer', function() {
  let origShowMessage

  beforeEach(() => {
    localStorage.clear()

    origShowMessage = snackBar.showMessage
    snackBar.showMessage = stub()
  })

  afterEach(() => {
    localStorage.clear()
    snackBar.showMessage = origShowMessage
  })

  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@INIT').toJS()).to.deep.equal({
        username: '',
        password: '',
        loggingIn: false,
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
    it('should handle the login of a newly registered user', async () => {
      const thunk = account.doLogin({
        username: 'user',
        password: 'pass',
        updateUserEmail: true
      })
      const backend = {
        webId: {getWebId: () => null},
        accounts: {
          loginAndSetup: stub().returns(
            Promise.resolve({webid: 'http://person/profile/card'})
          )
        }
      }
      const dispatch = stub()
      await thunk(dispatch, null, {backend})
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

      const result = await action.promise(backend)
      expect(result).to.deep.equal({
        username: 'user',
        webId: 'http://person/profile/card'
      })
      expect(backend.accounts.loginAndSetup.calledWithArgs).to.deep.equal([
        'user', 'pass', true
      ])

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
        }
      }
      const dispatch = stub()
      await thunk(dispatch, null, {backend})
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

    it('should handle user with expired session', async () => {
      const thunk = account.doLogin({
        username: 'user',
        password: 'pass',
        updateUserEmail: true
      })
      const backend = {
        webId: {getWebId: () => 'http://person/profile/card'},
        accounts: {
          checkLogin: stub().returns(Promise.reject(false))
          // loginAndSetup: stub().returns(
          //   Promise.resolve({webid: 'http://person/profile/card'})
          // ),
          // login: () => stub().returns(
          //   Promise.resolve({webid: 'http://person/profile/card'}
          // ))
        }
      }
      const dispatch = stub()
      await thunk(dispatch, null, {backend})
      const logoutThunk = dispatch.calledWithArgs[0]
      const logoutDispatch = stub()
      logoutThunk(logoutDispatch, null, {backend})
      const logoutAction = logoutDispatch.calledWithArgs[0]
      expect(logoutAction).to.deep.equal({
        type: 'little-sister/account/DO_LOGOUT'
      })

      let state = reducer(undefined, '@INIT')
      state = reducer(state, logoutAction)
      expect(state.toJS()).to.deep.equal(reducer(undefined, '@INIT').toJS())
    })
  })

  describe('doSignup', function() {
    it('should handle signup correctly', async () => {
      const thunk = account.doSignup({
        username: 'user',
        password: 'pass',
        name: 'the name',
        email: 'test@test.com'
      })
      const backend = {
        webId: {getWebId: () => 'http://person/profile/card'},
        accounts: {
          register: stub().returns(Promise.resolve({}))
        }
      }
      const dispatch = stub()
      await thunk(dispatch, null, {backend})
      const showVerifyAction = dispatch.calledWithArgs[0]
      expect(showVerifyAction).to.deep.equal(account.showEmailVerifyScreen())

      let state = reducer(undefined, '@INIT')
      state = reducer(state, showVerifyAction)
      expect(state.toJS()).to.deep.equal(
        reducer(undefined, '@INIT')
          .merge({emailVerifyScreen: true})
          .toJS()
      )
    })

    async function testSignupError({errorMessage, expectedMessage}) {
      const thunk = account.doSignup({
        username: 'user',
        password: 'pass',
        name: 'the name',
        email: 'test@test.com'
      })
      const backend = {
        webId: {getWebId: () => 'http://person/profile/card'},
        accounts: {
          register: stub().returns(
            Promise.reject({message: errorMessage})
          )
        }
      }
      const dispatch = stub()
      await thunk(dispatch, null, {backend})
      expect(snackBar.showMessage.calledWithArgs).to.deep.equal([{
        message: expectedMessage
      }])
    }

    it('should handle signup errors with messages', async () => {
      await testSignupError({errorMessage: 'huh?', expectedMessage: 'huh?'})
    })

    it('should handle signup errors with messages', async () => {
      await testSignupError({
        errorMessage: undefined,
        expectedMessage: 'An account error has occured.'
      })
    })
  })

  describe('doLogout', function() {
    it('should handle logout correctly', async () => {
      localStorage.setItem('jolocom.auth-mode', 'proxy')

      const thunk = account.doLogout()
      const backend = {
        accounts: {logout: stub()}
      }
      const dispatch = stub()
      thunk(dispatch, null, {backend})
      expect(backend.accounts.logout.called).to.be.true

      const action = dispatch.calledWithArgs[0]
      let state = reducer(undefined, '@INIT').merge({
        username: 'Usr',
        webId: 'WiD'
      })
      state = reducer(state, action)
      expect(state.toJS()).to.deep.equal(
        reducer(undefined, '@INIT')
          .merge({
            username: '',
            webId: null
          })
          .toJS()
      )
    })
  })

  describe('doActivateEmail', function() {
    it('should correctly handle e-mail activation', async () => {
      const thunk = account.doActivateEmail({
        username: 'user',
        code: 'secrut'
      })
      const backend = {
        accounts: {
          verifyEmail: stub().returns(Promise.resolve({email: 'test@test.com'}))
        }
      }
      const dispatch = stub()
      await thunk(dispatch, null, {backend})
      const action = dispatch.calledWithArgs[0]
      dispatch.reset()
      const result = await action.promise(backend)

      expect(snackBar.showMessage.calledWithArgs).to.deep.equal([{
        message: 'Your account has been activated!'
      }])

      let state = reducer(undefined, '@INIT')
      state = reducer(state, {
        type: account.doActivateEmail.id_success,
        result
      })
      expect(state.toJS()).to.deep.equal(
        reducer(undefined, '@INIT')
          .merge({
            emailUpdateQueued: true,
            emailToBeInserted: 'test@test.com',
            emailVerifyCompleted: true
          })
          .toJS()
      )
    })

    it('should handle errors correctly', async () => {
      // const thunk = account.doSignup({
      //   username: 'user',
      //   password: 'pass',
      //   name: 'the name',
      //   email: 'test@test.com'
      // })
      // const backend = {
      //   webId: {getWebId: () => 'http://person/profile/card'},
      //   accounts: {
      //     register: stub().returns(
      //       Promise.reject({message: errorMessage})
      //     )
      //   }
      // }
      // const dispatch = stub()
      // await thunk(dispatch, null, {backend})
      // const showMessageThunk = dispatch.calledWithArgs[0]

      // const showMessageDispatch = stub()
      // showMessageThunk(showMessageDispatch)
      // const showMessageAction = showMessageDispatch.calledWithArgs[0]
      // expect(showMessageAction)
      //       .to.deep.equal(snackBar.showMessage.buildAction({
      //   id: showMessageAction.id,
      //   message: expectedMessage
      // }))
    })
  })
})
