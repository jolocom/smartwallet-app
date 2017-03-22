/* global describe: true, it: true */
import {expect} from 'chai'
import Immutable from 'immutable'
import * as registration from './registration'
import {stub} from '../../../../test/utils'
const reducer = registration.default

describe.only('Wallet registration reducer', function() {
  describe('goForward', function() {
    describe('_canGoForward', function() {
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

  describe('_getNextURL', function() {
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

  describe('_getNextURLFromState', function() {
    it('should return null if we cannot continue', () => {
      expect(registration._getNextURLFromState(Immutable.fromJS({
        routing: {
          locationBeforeTransitions: {pathname: '/registration/user-type'}
        },
        registration: {userType: {valid: false}}
      }))).to.equal(null)
    })
  })
})
