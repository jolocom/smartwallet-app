/* global describe: true, it: true */
import {expect} from 'chai'
import Immutable from 'immutable'
import * as registration from './registration'
import * as router from './router'
import {stub, withStubs} from '../../../../test/utils'
const reducer = registration.default
const helpers = registration.helpers

describe.only('Wallet registration Redux module', function() {
  describe('goForward', function() {
    describe('action', function() {
      it('should dispatch the wallet registration action when complete', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({registration: {
          complete: true
        }})

        const thunk = registration.goForward()

        withStubs([
          [registration.actions, 'registerWallet', {returns: 'register'}]],
          () => {
            thunk(dispatch, getState)
            expect(dispatch.calledWithArgs)
              .to.deep.equal(['register'])
          }
        )
      })

      it('should go to the next page if requested', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({registration: {
          complete: false
        }})

        const thunk = registration.goForward()

        withStubs([
          [router, 'pushRoute', {returns: 'push'}],
          [registration.helpers, '_getNextURLFromState', {returns: '/next/'}]],
          () => {
            thunk(dispatch, getState)
            expect(dispatch.calledWithArgs)
              .to.deep.equal(['push'])
            expect(router.pushRoute.calledWithArgs)
              .to.deep.equal(['/next/'])
          }
        )
      })
    })

    describe('_canGoForward()', function() {
      it('should return true if there is nothing to check', function() {
        expect(helpers._canGoForward(Immutable.fromJS({
          registration: {}
        }), '/registration/something')).to.equal(true)
      })

      it('should return true if the validation for a page succeeds', () => {
        const test = (path, key) => {
          expect(helpers._canGoForward(Immutable.fromJS({
            registration: {[key]: {valid: true}}
          }), path)).to.equal(true)
        }
        test('/registration', 'username')
        test('/registration/user-type', 'userType')
        test('/registration/entropy', 'entropy')
        test('/registration/write-phrase', 'passphrase')
        test('/registration/email', 'email')
        test('/registration/password', 'password')
        test('/registration/pin', 'pin')
      })

      it('should return false if the validation for a page fails', () => {
        const test = (path, key) => {
          expect(helpers._canGoForward(Immutable.fromJS({
            registration: {[key]: {valid: false}}
          }), path)).to.equal(false)
        }
        test('/registration', 'username')
        test('/registration/user-type', 'userType')
        test('/registration/entropy', 'entropy')
        test('/registration/write-phrase', 'passphrase')
        test('/registration/email', 'email')
        test('/registration/password', 'password')
        test('/registration/pin', 'pin')
      })
    })
  })

  describe('_getNextURL()', function() {
    it('should return correct URL when choosing expert', () => {
      expect(helpers._getNextURL('/registration/user-type', 'expert'))
        .to.equal('/registration/write-phrase')
    })
    it('should return correct URL when choosing layman', () => {
      expect(helpers._getNextURL('/registration/user-type', 'layman'))
        .to.equal('/registration/phrase-info')
    })
    it('should return correct next URL', () => {
      const test = (url, next) =>
        expect(helpers._getNextURL(url)).to.equal(next)

      test('/registration/user-type', '/registration/phrase-info')
      test('/registration', '/registration/entropy')
      test('/registration/entropy', '/registration/user-type')
      test('/registration/write-phrase', '/registration/pin')
      test('/registration/phrase-info', '/registration/email')
      test('/registration/email', '/registration/password')
      test('/registration/password', '/registration/pin')
    })
  })

  describe('_getNextURLFromState()', function() {
    it('should return null if we cannot continue', () => {
      expect(helpers._getNextURLFromState(Immutable.fromJS({
        routing: {
          locationBeforeTransitions: {pathname: '/registration/user-type'}
        },
        registration: {userType: {valid: false}}
      }))).to.equal(null)
    })
    it('should return the correct next page', () => {
      expect(helpers._getNextURLFromState(Immutable.fromJS({
        routing: {
          locationBeforeTransitions: {pathname: '/registration'}
        },
        registration: {username: {valid: true, value: 'Tom'}}
      }))).to.equal(
        helpers._getNextURL('/registration', null)
      )
    })
    it('should return the correct next page after user type selection', () => {
      expect(helpers._getNextURLFromState(Immutable.fromJS({
        routing: {
          locationBeforeTransitions: {pathname: '/registration/user-type'}
        },
        registration: {userType: {valid: true, value: 'expert'}}
      }))).to.equal(
        helpers._getNextURL('/registration/user-type', 'expert')
      )
    })
  })

  describe('_isComplete()', function() {
    const test = ({invalid, result, userType = null}) => {
      invalid = new Immutable.Set(invalid)
      expect(helpers._isComplete(Immutable.fromJS({
        username: {valid: !invalid.has('username')},
        userType: {
          valid: !invalid.has('userType'),
          value: userType
        },
        pin: {valid: !invalid.has('pin')},
        email: {valid: !invalid.has('email')},
        password: {valid: !invalid.has('password')},
        passphrase: {valid: !invalid.has('passphrase')}
      }))).to.equal(result)
    }

    it('should return false if nothing is filled in', () => {
      test({
        invalid: [
          'username', 'userType', 'pin', 'emai',
          'password', 'passphrase'
        ],
        result: false
      })
    })

    it('should return false if one of the base fields is missing', () => {
      test({invalid: ['username'], result: false})
      test({invalid: ['userType'], result: false})
      test({invalid: ['pin'], result: false})
    })

    it('should return false if required expert fields are missing', () => {
      test({invalid: ['passphrase'], result: false, userType: 'expert'})
    })

    it('should return true if all required expert fields are there', () => {
      test({invalid: ['email', 'password'], result: true, userType: 'expert'})
    })

    it('should return true if all required layman fields are there', () => {
      test({invalid: ['passphrase'], result: true, userType: 'layman'})
    })

    it('should return false if required layman fields are missing', () => {
      test({invalid: ['email', 'password'], result: false, userType: 'layman'})
    })
  })
})
