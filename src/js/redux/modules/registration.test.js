/* global describe: true, it: true */
import {expect} from 'chai'
import Immutable from 'immutable'
import * as registration from './registration'
import * as router from './router'
import {stub, withStubs} from '../../../../test/utils'
const reducer = require('./registration').default
const helpers = registration.helpers

describe('Wallet registration Redux module', function() {
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
      expect(helpers._getNextURLFromState(new Immutable.Map({
        routing: {
          locationBeforeTransitions: {pathname: '/registration/user-type'}
        },
        registration: Immutable.fromJS({userType: {valid: false}})
      }))).to.equal(null)
    })

    it('should return the correct next page', () => {
      expect(helpers._getNextURLFromState(new Immutable.Map({
        routing: {
          locationBeforeTransitions: {pathname: '/registration'}
        },
        registration: Immutable.fromJS({username: {valid: true, value: 'Tom'}})
      }))).to.equal(
        helpers._getNextURL('/registration', null)
      )
    })

    it('should return the correct next page after user type selection', () => {
      expect(helpers._getNextURLFromState(new Immutable.Map({
        routing: {
          locationBeforeTransitions: {pathname: '/registration/user-type'}
        },
        registration: Immutable.fromJS({userType: {
          valid: true, value: 'expert'
        }})
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

  describe('addEntropyFromDeltas', function() {
    it('should not do anything when phrase is already generated', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        passphrase: {phrase: 'xyx'}
      }})
      const services = {entropy: {addFromDelta: stub()}}

      const thunk = registration.addEntropyFromDeltas({dx: 5, dy: 3})
      thunk(dispatch, getState, {services})

      expect(services.entropy.addFromDelta.called).to.equal(false)
    })

    it('should add entropy when necessary', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        passphrase: {phrase: null}
      }})
      const services = {entropy: {
        addFromDelta: stub(),
        isReady: stub().returns(false),
        getProgress: stub().returns(0.5),
        getRandomString: stub().returns('bla')
      }}

      const thunk = registration.addEntropyFromDeltas({dx: 5, dy: 3})
      thunk(dispatch, getState, {services})

      expect(services.entropy.addFromDelta.called).to.equal(true)
      expect(dispatch.calls).to.deep.equal([{args: [
        registration.setEntropyStatus({
          sufficientEntropy: false,
          progress: 0.5
        })
      ]}])
      expect(services.entropy.getRandomString.called).to.equal(false)
    })

    it('should generate the seedphrase when ready', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        passphrase: {phrase: null}
      }})
      const services = {entropy: {
        addFromDelta: stub(),
        isReady: stub().returns(true),
        getProgress: stub().returns(1),
        getRandomString: stub().returns('bla bla bla bla bla bla bla')
      }}
      const backend = {wallet: {
        generateSeedPhrase: stub().returns('seedphrase')
      }}

      const thunk = registration.addEntropyFromDeltas({dx: 5, dy: 3})
      thunk(dispatch, getState, {services, backend})

      expect(services.entropy.addFromDelta.called).to.equal(true)
      expect(services.entropy.getRandomString.called).to.equal(true)
      expect(backend.wallet.generateSeedPhrase.called).to.equal(true)
      expect(dispatch.calls).to.deep.equal([
        {args: [registration.setEntropyStatus({
          sufficientEntropy: true,
          progress: 1
        })]},
        {args: [registration.setPassphrase({
          phrase: 'seedphrase'
        })]}
      ])
    })
  })

  describe('submitPin', function() {
    it('should not do anything if the pin is not valid', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        pin: {valid: false}
      }})

      const thunk = registration.submitPin()
      thunk(dispatch, getState)

      expect(dispatch.calls).to.deep.equal([])
    })

    it('should confirm when the pin is valid', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        pin: {valid: true, confirm: false}
      }})

      withStubs([
          [registration.actions, 'setPinConfirm', {returns: 'confirm'}]],
          () => {
            const thunk = registration.submitPin()
            thunk(dispatch, getState)
            expect(dispatch.calls).to.deep.equal([{args: ['confirm']}])
          }
      )
    })

    it('should go forward if the pin is valid and confirmed', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        pin: {valid: true, confirm: true}
      }})

      withStubs([
          [registration.actions, 'goForward', {returns: 'forward'}]],
          () => {
            const thunk = registration.submitPin()
            thunk(dispatch, getState)
            expect(dispatch.calls).to.deep.equal([{args: ['forward']}])
          }
      )
    })
  })

  describe('registerWallet', function() {
    it('should register with seedphrase if expert', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        userType: {value: 'expert'},
        username: {value: 'usr'},
        pin: {value: '1234'},
        passphrase: {phrase: 'bla bla bla'},
        email: {value: 'test@test.com'},
        password: {value: 'abdcd'}
      }})
      const backend = {wallet: {
        registerWithSeedPhrase: stub().returns('regSeed'),
        registerWithCredentials: stub().returns('regCreds')
      }}

      withStubs([
        [registration.actions, 'goForward', {returns: 'forward'}],
        [registration.actions.registerWallet, 'buildAction',
          {returns: 'action'}]],
        () => {
          const thunk = registration.registerWallet()
          thunk(dispatch, getState)
          expect(dispatch.calledWithArgs[0]).to.equal('action')

          const registerAction = registration.actions.registerWallet
          const promise = registerAction.buildAction.calledWithArgs[1]
          expect(promise(backend))
            .to.equal(backend.wallet.registerWithSeedPhrase.returns())
          expect(backend.wallet.registerWithSeedPhrase.calls)
            .to.deep.equal([{args: [{
              seedPhrase: 'bla bla bla',
              userName: 'usr'
            }]}])
        }
      )
    })

    it('should register with credentials if expert', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        userType: {value: 'layman'},
        username: {value: 'usr'},
        pin: {value: '1234'},
        passphrase: {phrase: 'bla bla bla'},
        email: {value: 'test@test.com'},
        password: {value: 'abdcd'}
      }})
      const backend = {wallet: {
        registerWithSeedPhrase: stub().returns('regSeed'),
        registerWithCredentials: stub().returns('regCreds')
      }}

      withStubs([
        [registration.actions, 'goForward', {returns: 'forward'}],
        [registration.actions.registerWallet, 'buildAction',
          {returns: 'action'}]],
        () => {
          const thunk = registration.registerWallet()
          thunk(dispatch, getState)
          expect(dispatch.calledWithArgs[0]).to.equal('action')

          const registerAction = registration.actions.registerWallet
          const promise = registerAction.buildAction.calledWithArgs[1]
          expect(promise(backend))
            .to.equal(backend.wallet.registerWithCredentials.returns())
          expect(backend.wallet.registerWithCredentials.calls)
            .to.deep.equal([{args: [{
              userName: 'usr',
              email: 'test@test.com',
              password: 'abdcd'
            }]}])
        }
      )
    })
  })

  describe('reducer', function() {
    describe('setUserType', function() {
      it('should correctly initialize', () => {
        let state = reducer(undefined, '@@INIT')

        expect(state.get('userType').toJS())
          .to.deep.equal({value: '', valid: false})
      })

      it('should throw an error when supplying invalid value', () => {
        expect(() => reducer(Immutable.fromJS({
        }), registration.setUserType('bla'))).to.throw('Invalid user type: bla')
      })

      it('should be able to set the user type to a valid value', () => {
        let state = reducer(undefined, '@@INIT')

        state = reducer(state, registration.setUserType('expert'))
        expect(state.get('userType').toJS())
          .to.deep.equal({value: 'expert', valid: true})

        state = reducer(state, registration.setUserType('layman'))
        expect(state.get('userType').toJS())
          .to.deep.equal({value: 'layman', valid: true})
      })
    })
    describe('setPassword', function() {
      it('should correctly initialize', () => {
        let state = reducer(undefined, '@@INIT')

        expect(state.get('password').toJS())
          .to.deep.equal({
            value: '',
            repeated: '',
            strength: 'weak',
            hasLowerCase: false,
            hasUpperCase: false,
            hasDigit: false,
            valid: false
          })
      })
    })
    // describe('setRepeatedPassword', function() {
    //   it('should correctly initialize', () => {
    //     let state = reducer(undefined, '@@INIT')

    //     expect(state.get('userType').toJS())
    //       .to.deep.equal({value: '', valid: false})
    //   })
    // })
    describe('setEntropyStatus', function() {
      it('should correctly initialize', () => {
        let state = reducer(undefined, '@@INIT')

        expect(state.get('passphrase').toJS())
          .to.deep.equal({
            sufficientEntropy: false,
            progress: 0,
            randomString: null,
            phrase: null,
            writtenDown: false,
            valid: false
          })
      })
    })
    // describe('setRandomString', function() {
    //   it('should correctly initialize', () => {
    //     let state = reducer(undefined, '@@INIT')

    //     expect(state.get('userType').toJS())
    //       .to.deep.equal({value: '', valid: false})
    //   })
    // })
    // describe('setPassphrase', function() {
    //   it('should correctly initialize', () => {
    //     let state = reducer(undefined, '@@INIT')

    //     expect(state.get('userType').toJS())
    //       .to.deep.equal({value: '', valid: false})
    //   })
    // })
    describe('setPin', function() {
      it('should correctly initialize', () => {
        let state = reducer(undefined, '@@INIT')

        expect(state.get('pin').toJS())
          .to.deep.equal({
            value: '',
            focused: false,
            confirm: false,
            valid: false
          })
      })
    })
    // describe('setPinConfirm', function() {
    //   it('should correctly initialize', () => {
    //     let state = reducer(undefined, '@@INIT')

    //     expect(state.get('userType').toJS())
    //       .to.deep.equal({value: '', valid: false})
    //   })
    // })
    // describe('setPinFocused', function() {
    //   it('should correctly initialize', () => {
    //     let state = reducer(undefined, '@@INIT')

    //     expect(state.get('userType').toJS())
    //       .to.deep.equal({value: '', valid: false})
    //   })
    // })
    describe('setEmail', function() {
      it('should correctly initialize', () => {
        let state = reducer(undefined, '@@INIT')

        expect(state.get('email').toJS())
          .to.deep.equal({value: '', valid: false})
      })
    })
    // describe('setPassphraseWrittenDown', function() {
    //   it('should correctly initialize', () => {
    //     let state = reducer(undefined, '@@INIT')

    //     expect(state.get('userType').toJS())
    //       .to.deep.equal({value: '', valid: false})
    //   })
    // })
    describe('registerWallet', function() {
      it('should correctly initialize', () => {
        let state = reducer(undefined, '@@INIT')

        expect(state.get('wallet').toJS())
          .to.deep.equal({
            registering: false,
            registered: false,
            errorMsg: null
          })
      })
    })
  })
})
