/* global describe: true, it: true */
import {expect} from 'chai'
import Immutable from 'immutable'
import * as registration from './registration'
import * as router from './router'
import {stub, withStubs} from '../../../../test/utils'
const reducer = require('./registration').default
const helpers = registration.helpers

describe('Wallet registration Redux module', () => {
  describe('goForward', () => {
    describe('action', () => {
      it('should dispatch the wallet registration action when complete', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({registration: {
          complete: true
        }})

        const thunk = registration.goForward()

        withStubs([
          [registration.actions, 'registerWallet', {returns: 'register'}],
          [router, 'pushRoute', {returns: 'push'}],
          [registration.helpers, '_getNextURLFromState', {returns: '/next/'}]],
          () => {
            thunk(dispatch, getState)
            expect(dispatch.calls)
              .to.deep.equal([{
                args: [
                  'register'
                ]
              }])
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

    describe('_canGoForward()', () => {
      it('should return true if there is nothing to check', () => {
        expect(helpers._canGoForward(Immutable.fromJS({
          registration: {}
        }), '/registration/something')).to.equal(true)
      })

      it('should return true if the validation for a page succeeds', () => {
        const test = (path, key) => {
          expect(helpers._canGoForward(Immutable.fromJS({
            registration: {[key[0]]: {[key[1]]: true}}
          }), path)).to.equal(true)
        }
        test('/registration', ['username', 'valid'])
        test('/registration/entropy', ['passphrase', 'sufficientEntropy'])
        test('/registration/user-type', ['userType', 'valid'])
        test('/registration/write-phrase', ['passphrase', 'writtenDown'])
        test('/registration/phrase-info', ['passphrase', 'writtenDown'])
        test('/registration/email', ['email', 'valid'])
        test('/registration/password', ['password', 'valid'])
      })

      it('should return false if the validation for a page fails', () => {
        const test = (path, key) => {
          expect(helpers._canGoForward(Immutable.fromJS({
            registration: {[key[0]]: {[key[1]]: false}}
          }), path)).to.equal(false)
        }
        test('/registration', ['username', 'valid'])
        test('/registration/entropy', ['passphrase', 'sufficientEntropy'])
        test('/registration/user-type', ['userType', 'valid'])
        test('/registration/write-phrase', ['passphrase', 'writtenDown'])
        test('/registration/phrase-info', ['passphrase', 'writtenDown'])
        test('/registration/email', ['email', 'valid'])
        test('/registration/password', ['password', 'valid'])
      })
    })
  })

  describe('_getNextURL()', () => {
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
      test('/registration/phrase-info', '/registration/email')
      test('/registration/email', '/registration/password')
    })
  })

  describe('_getNextURLFromState()', () => {
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
  it('should return the correct next page to switch from layman to expert',
  () => {
    expect(helpers._getNextURLFromState(new Immutable.Map({
      routing: {
        locationBeforeTransitions: {pathname: '/registration/phrase-info'}
      },
      registration: Immutable.fromJS({userType: {
        valid: true, value: 'expert'
      }})
    }))).to.equal(
      '/registration/write-phrase'
    )
  })
  it('should return the correct next page to switch from expert to layman',
    () => {
      expect(helpers._getNextURLFromState(new Immutable.Map({
        routing: {
          locationBeforeTransitions: {pathname: '/registration/write-phrase'}
        },
        registration: Immutable.fromJS({userType: {
          valid: true, value: 'layman'
        }})
      }))).to.equal(
        '/registration/phrase-info'
      )
    }
  )
  describe('_isComplete()', () => {
    const test = ({invalid, result, userType = null}) => {
      invalid = new Immutable.Set(invalid)
      expect(helpers._isComplete(Immutable.fromJS({
        username: {valid: !invalid.has('username')},
        userType: {
          valid: !invalid.has('userType'),
          value: userType
        },
        email: {valid: !invalid.has('email')},
        password: {valid: !invalid.has('password')},
        passphrase: {valid: !invalid.has('passphrase')}
      }))).to.equal(result)
    }

    it('should return false if nothing is filled in', () => {
      test({
        invalid: [
          'username', 'userType', 'email',
          'password', 'passphrase'
        ],
        result: false
      })
    })

    it('should return false if one of the base fields is missing', () => {
      test({invalid: ['username'], result: false})
      test({invalid: ['userType'], result: false})
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

  describe('addEntropyFromDeltas', () => {
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
        passphrase: {phrase: ''}
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

    it('should set the randomString when entropy is ready', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        passphrase: {phrase: ''}
      }})
      const services = {entropy: {
        addFromDelta: stub(),
        isReady: stub().returns(true),
        getProgress: stub().returns(1),
        getRandomString: stub().returns('bla bla bla bla bla bla bla')
      }}

      const thunk = registration.addEntropyFromDeltas({
        dx: 5,
        dy: 3
      })
      thunk(dispatch, getState, {services})

      expect(services.entropy.addFromDelta.called).to.equal(true)
      expect(services.entropy.getRandomString.called).to.equal(true)
      expect(dispatch.calls).to.deep.equal([
        {args: [registration.setEntropyStatus({
          sufficientEntropy: true,
          progress: 1
        })]},
        {args: [registration.setRandomString({
          randomString: 'bla bla bla bla bla bla bla'
        })]}
      ])
    })
  })

  describe('submitEntropy', () => {
    it('should send an error message if there is not enough entropy', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        passphrase: {sufficientEntropy: false}
      }})
      const readyE = registration.submitEntropy()
      readyE(dispatch, getState)

      expect(dispatch.calls).to.deep.equal([])
    })
    it('should trigger generateseedphrase when there is enough entropy', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        passphrase: {sufficientEntropy: true}
      }})
      withStubs([
        [registration.actions, 'generateSeedPhrase', {returns: 'generated'}]],
        () => {
          const readyE = registration.submitEntropy()
          readyE(dispatch, getState)
          expect(dispatch.calls).to.deep.equal([{args: ['generated']}])
        }
    )
    })
  })

  describe('generateSeedPhrase', () => {
    it('should not do anything is there is no randomString', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        passphrase: {randomString: ''}
      }})
      const backend = {gateway: {
        generateSeedPhrase: stub().returnsAsync('seedphrase')
      }}
      const generate = registration.actions.generateSeedPhrase
      generate(dispatch, getState, {backend})

      expect(backend.gateway.generateSeedPhrase.called).to.equal(false)
    })

    // eslint-disable-next-line max-len
    // it('should call generateSeedPhrase if there is a randomString present', () => {
    //   const dispatch = stub()
    //   const getState = () => Immutable.fromJS({registration: {
    //     passphrase: {randomString: '0123091023981029381098'}
    //   }})
    //   const backend = {gateway: {
    //     generateSeedPhrase: stub().returnsAsync('seedphrase')
    //   }}

    //   withStubs([
    //     [registration.actions.generateSeedPhrase, 'buildAction',
    //     {returns: 'action'}]],
    //     () => {
    //       const thunk = registration.generateSeedPhrase('test')
    //       thunk(dispatch, getState)
    //       expect(dispatch.calledWithArgs[0]).to.equal('action')
          // const generate = registration.actions.generateSeedPhrase
          // const promise = generate.buildAction.calledWithArgs[1]
          // expect(backend.gateway.generateSeedPhrase.called).to.be.true
          // expect(promise(backend)).to.eventually.equal('seedphrase')
          // expect(backend.gateway.generateSeedPhrase.calls)
          // .to.deep.equal([{args: [{
          //   seedPhrase: 'seedphrase'
          // }]}])
    //     })
    // })
  })

  describe('checkCredentials', () => {
    it('should checkUsername on backend', () => {
      const getState = () => Immutable.fromJS({registration: {
        username: {value: 'ggdg'}
      }})
      const dispatch = stub()
      const backend = {gateway: {
        checkUserDoesNotExist: stub().returnsAsync('checks')
      }}
      withStubs([
      [registration.actions, 'goForward', {returns: 'forward'}],
        [registration.actions.checkCredentials, 'buildAction',
        {returns: 'action'}]],
      () => {
        const thunk = registration.checkCredentials('test')
        thunk(dispatch, getState)
        expect(dispatch.calledWithArgs[0]).to.equal('action')
        const checkCredentials = registration.actions.checkCredentials
        const promise = checkCredentials.buildAction.calledWithArgs[1]
        expect(promise(backend)).to.eventually
        .equal('checks')
        expect(backend.gateway.checkUserDoesNotExist.calls).to.deep.equal(
          [{args: [{userName: 'ggdg'}]}
          ])
      })
    })
  })

  describe('registerWallet', () => {
    it('should register with seedphrase if expert', () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({registration: {
        userType: {value: 'expert'},
        username: {value: 'usr'},
        passphrase: {phrase: 'bla bla bla'},
        ownURL: {valueOwnURL: 'test'},
        email: {value: 'test@test.com'},
        password: {value: 'abdcd'},
        inviteCode: null
      }})
      const services = {
        auth: {
          register: stub().returnsAsync('regSeed'),
          registerWithCredentials: stub().returnsAsync('regCreds')
        }
      }
      const backend = {
        accounts: {
          solidRegister: stub(),
          solidLogin: stub()
        },
        solid: {
          setIdentityContractAddress: stub()
        }
      }
      withStubs([
        [registration.actions, 'goForward', {returns: 'forward'}],
        [registration.actions.registerWallet, 'buildAction',
          {returns: 'action'}]],
        () => {
          const thunk = registration.registerWallet()
          thunk(dispatch, getState, {services, backend})
          expect(dispatch.calledWithArgs[0]).to.equal('action')
          const registerAction = registration.actions.registerWallet
          const promise = registerAction.buildAction.calledWithArgs[1]
          expect(promise(services.auth.register))
            .to.eventually.equal('regSeed')
          expect(services.auth.register.called).to.be.true
          expect(services.auth.register.calls)
            .to.deep.equal([{args: [{
              seedPhrase: 'bla bla bla',
              userName: 'usr',
              inviteCode: null,
              gatewayUrl: 'test'
            }]}])
        }
      )
    })
    // it('should register with credentials if layman', () => {
    //   const dispatch = stub()
    //   const getState = () => Immutable.fromJS({registration: {
    //     userType: {value: 'layman'},
    //     username: {value: 'usr'},
    //     pin: {value: '1234'},
    //     passphrase: {phrase: 'bla bla bla'},
    //     email: {value: 'test@test.com'},
    //     password: {value: 'abdcd'}
    //   }})
    //   const services = {auth: {
    //     registerWithSeedPhrase: stub().returnsAsync('regSeed'),
    //     registerWithCredentials: stub().returnsAsync('regCreds')
    //   }}
    //
    //   withStubs([
    //     [registration.actions, 'goForward', {returns: 'forward'}],
    //     [registration.actions.registerWallet, 'buildAction',
    //       {returns: 'action'}]],
    //     () => {
    //       const thunk = registration.registerWallet()
    //       thunk(dispatch, getState, {backend: {}, services})
    //       expect(dispatch.calledWithArgs[0]).to.equal('action')
    //       const registerAction = registration.actions.registerWallet
    //       const promise = registerAction.buildAction.calledWithArgs[1]
    //       expect(promise(services.auth.registerWithCredentials))
    //         .to.eventually.equal('regCreds')
    //       expect(services.auth.registerWithCredentials.called).to.be.true
    //       expect(services.auth.registerWithCredentials.calls)
    //         .to.deep.equal([{args: [{
    //           userName: 'usr',
    //           email: 'test@test.com',
    //           password: 'abdcd',
    //           seedPhrase: 'bla bla bla',
    //           pin: '1234'
    //         }]}])
    //     }
    //   )
    // })
  })

  describe('reducer', () => {
    describe('setUserType', () => {
      it('should correctly initialize', () => {
        const state = reducer(undefined, '@@INIT')

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
    describe('password', () => {
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

      it('should correctly update the password', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, registration.setPassword('test'))

        expect(state.get('password').toJS())
          .to.deep.equal({
            value: 'test',
            repeated: '',
            strength: 'weak',
            hasLowerCase: true,
            hasUpperCase: false,
            hasDigit: false,
            valid: false
          })
      })

      it('should detect uppercase letters', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, registration.setPassword('Test'))

        expect(state.get('password').toJS())
          .to.deep.equal({
            value: 'Test',
            repeated: '',
            strength: 'weak',
            hasLowerCase: true,
            hasUpperCase: true,
            hasDigit: false,
            valid: false
          })
      })

      it('should detect digits', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, registration.setPassword('Test123'))

        expect(state.get('password').toJS())
          .to.deep.equal({
            value: 'Test123',
            repeated: '',
            strength: 'weak',
            hasLowerCase: true,
            hasUpperCase: true,
            hasDigit: true,
            valid: false
          })
      })

      it('should detect good password strength', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, registration.setPassword('TestTime123'))

        expect(state.get('password').toJS())
          .to.deep.equal({
            value: 'TestTime123',
            repeated: '',
            strength: 'good',
            hasLowerCase: true,
            hasUpperCase: true,
            hasDigit: true,
            valid: false
          })
      })

      it('should detect strong password strength', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, registration.setPassword('TeStTiMe526!@#'))

        expect(state.get('password').toJS())
          .to.deep.equal({
            value: 'TeStTiMe526!@#',
            repeated: '',
            strength: 'strong',
            hasLowerCase: true,
            hasUpperCase: true,
            hasDigit: true,
            valid: false
          })
      })

      it('should clear repeated password when editing original', () => {
        let state = reducer(undefined, '@@INIT')
        state = state.setIn(['password', 'repeated'], 'test')
        state = reducer(state, registration.setPassword('TeStTiMe526!@#'))

        expect(state.get('password').toJS())
          .to.deep.equal({
            value: 'TeStTiMe526!@#',
            repeated: '',
            strength: 'strong',
            hasLowerCase: true,
            hasUpperCase: true,
            hasDigit: true,
            valid: false
          })
      })

      it('should detect invalid repeated passwords', () => {
        let state = reducer(undefined, '@@INIT')
        state = state.setIn(['password', 'repeated'], 'test')
        state = reducer(state, registration.setPassword('TeStTiMe526!@#'))
        state = reducer(state, registration.setRepeatedPassword('TeStTiMe'))

        expect(state.get('password').toJS())
          .to.deep.equal({
            value: 'TeStTiMe526!@#',
            repeated: 'TeStTiMe',
            strength: 'strong',
            hasLowerCase: true,
            hasUpperCase: true,
            hasDigit: true,
            valid: false
          })
      })

      it('should detect valid repeated passwords', () => {
        let state = reducer(undefined, '@@INIT')
        state = state.setIn(['password', 'repeated'], 'test')
        state = reducer(state, registration.setPassword('TeStTiMe526!@#'))
        state = reducer(state,
          registration.setRepeatedPassword('TeStTiMe526!@#'))

        expect(state.get('password').toJS())
          .to.deep.equal({
            value: 'TeStTiMe526!@#',
            repeated: 'TeStTiMe526!@#',
            strength: 'strong',
            hasLowerCase: true,
            hasUpperCase: true,
            hasDigit: true,
            valid: true
          })
      })
    })
    describe('setEntropyStatus', () => {
      it('should correctly initialize', () => {
        let state = reducer(undefined, '@@INIT')

        expect(state.get('passphrase').toJS())
          .to.deep.equal({
            sufficientEntropy: false,
            progress: 0,
            randomString: '',
            phrase: '',
            generating: false,
            generated: false,
            writtenDown: false,
            valid: false
          })
      })
      it('should correctly update', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, registration.setEntropyStatus({
          sufficientEntropy: 'bla',
          progress: 0.4
        }))

        expect(state.get('passphrase').toJS())
          .to.deep.equal({
            sufficientEntropy: 'bla',
            progress: 0.4,
            randomString: '',
            phrase: '',
            generating: false,
            generated: false,
            writtenDown: false,
            valid: false
          })
      })
    })
    describe('setEmail', () => {
      it('should correctly initialize', () => {
        let state = reducer(undefined, '@@INIT')

        expect(state.get('email').toJS())
          .to.deep.equal({value: '', errorMsg: '', valid: false})
      })

      it('should correctly update', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, registration.setEmail('test'))

        expect(state.get('email').toJS())
          .to.deep.equal({value: 'test', errorMsg: '', valid: false})
      })

      it('should correctly detect valid e-mail addresses', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, registration.setEmail('test@test.com'))

        expect(state.get('email').toJS())
          .to.deep.equal({value: 'test@test.com', errorMsg: '', valid: true})
      })
    })
    // describe('setPassphraseWrittenDown', () => {
    //   it('should correctly initialize', () => {
    //     let state = reducer(undefined, '@@INIT')

    //     expect(state.get('userType').toJS())
    //       .to.deep.equal({value: '', valid: false})
    //   })
    // })
    describe('registerWallet', () => {
      it('should correctly initialize', () => {
        let state = reducer(undefined, '@@INIT')

        expect(state.get('wallet').toJS())
          .to.deep.equal({
            registering: false,
            registered: false,
            errorMsg: null
          })
      })

      it('should correctly handle registration start', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, {
          type: registration.registerWallet.id
        })

        expect(state.get('wallet').toJS())
          .to.deep.equal({
            registering: true,
            registered: false,
            errorMsg: null
          })
      })

      it('should correctly handle registration success', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, {
          type: registration.registerWallet.id_success
        })

        expect(state.get('wallet').toJS())
          .to.deep.equal({
            registering: true,
            registered: true,
            errorMsg: null
          })
      })

      it('should correctly handle registration fail', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, {
          type: registration.registerWallet.id_fail,
          error: new Error('test')
        })

        expect(state.get('wallet').toJS())
          .to.deep.equal({
            registering: false,
            registered: false,
            errorMsg: 'test'
          })
      })
    })
  })
})
