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
          [router, 'pushRoute', {returns: 'push'}]],
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
          [registration.helpers, '_getNextURLfromState', {returns: '/next/'}]],
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

    describe('_getNextURLFromState()', () => {
// TODO write new tests for modified functionality
    })

    describe('_isComplete()', () => {
      const test = ({invalid, result, userType = null}) => {
        invalid = new Immutable.Set(invalid)
        expect(helpers._isComplete(Immutable.fromJS({
          username: {valid: !invalid.has('username')},
          passphrase: {valid: !invalid.has('passphrase')}
        }))).to.equal(result)
      }

      it('should return false if nothing is filled in', () => {
        test({
          invalid: [
            'username',
            'passphrase'
          ],
          result: false
        })
      })

      it('should return false if one of the base fields is missing', () => {
        test({invalid: ['username'], result: false})
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

    describe('registerWallet', () => {
      it('should register with seedphrase', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({registration: {
          username: {value: 'usr'},
          passphrase: {phrase: 'bla bla bla'},
          ownURL: {valueOwnURL: 'test'},
          inviteCode: null
        }})
        const services = {
          auth: {
            register: stub().returnsAsync('regSeed')
          }
        }
        withStubs([
          [registration.actions, 'goForward', {returns: 'forward'}],
          [registration.actions.registerWallet, 'buildAction',
          {returns: 'action'}]],
          () => {
            const thunk = registration.registerWallet()
            thunk(dispatch, getState, {services})
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
