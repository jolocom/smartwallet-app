/* global describe: true, it: true */
import {expect} from 'chai'
import Immutable from 'immutable'
import * as registration from './registration'
import {stub} from '../../../../test/utils'
const reducer = registration.default

describe.only('Wallet registration reducer', function() {
  describe('goForward', function() {
    describe('_canGoForward()', function() {
      it('should return true if there is nothing to check', function() {
        expect(registration._canGoForward(Immutable.fromJS({
          registration: {}
        }), '/registration/something')).to.equal(true)
      })

      it('should return true if the validation for a page succeeds', () => {
        const test = (path, key) => {
          expect(registration._canGoForward(Immutable.fromJS({
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
          expect(registration._canGoForward(Immutable.fromJS({
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
      expect(registration._getNextURL('/registration/user-type', 'expert'))
        .to.equal('/registration/write-phrase')
    })
    it('should return correct URL when choosing layman', () => {
      expect(registration._getNextURL('/registration/user-type', 'layman'))
        .to.equal('/registration/phrase-info')
    })
    it('should return correct next URL', () => {
      const test = (url, next) =>
        expect(registration._getNextURL(url)).to.equal(next)

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
      expect(registration._getNextURLFromState(Immutable.fromJS({
        routing: {
          locationBeforeTransitions: {pathname: '/registration/user-type'}
        },
        registration: {userType: {valid: false}}
      }))).to.equal(null)
    })
    it('should return the correct next page', () => {
      expect(registration._getNextURLFromState(Immutable.fromJS({
        routing: {
          locationBeforeTransitions: {pathname: '/registration'}
        },
        registration: {username: {valid: true, value: 'Tom'}}
      }))).to.equal(
        registration._getNextURL('/registration', null)
      )
    })
    it('should return the correct next page after user type selection', () => {
      expect(registration._getNextURLFromState(Immutable.fromJS({
        routing: {
          locationBeforeTransitions: {pathname: '/registration/user-type'}
        },
        registration: {userType: {valid: true, value: 'expert'}}
      }))).to.equal(
        registration._getNextURL('/registration/user-type', 'expert')
      )
    })
  })

  describe('_isComplete()', function() {
    // const test = ({invalid, result}) => {
    //   expect(registration._isComplete(Immutable.fromJS({
    //     username: {valid: !invalid.username},
    //     userType: {valid: !invalid.userType},
    //     pin: {valid: !invalid.pin},
    //     email: {valid: !invalid.email},
    //     password: {valid: !invalid.password},
    //     passphrase: {valid: !invalid.passphrase}
    //   }))).to.equal(result)
    // }

    // it('should return false if nothing is filled in', () => {
    //   test({
    //     invalid: [
    //       'username', 'userType', 'pin', 'emai',
    //       'password', 'passphrase'
    //     ],
    //     result: false
    //   })
    // })

    // it('should return false if one of the base fields is missing', () => {
    //   test({invalid: ['username'], result: false})
    //   test({invalid: ['userType'], result: false})
    //   test({invalid: ['pin'], result: false})
    // })
  })
})
