/* global describe: true, it: true */
import { expect } from 'chai'
import Immutable from 'immutable'
import { actions, helpers } from './registration'
import router from './router'
import {stub, withStubs} from '../../../../test/utils'
// eslint-disable-next-line
import reducer from './registration'

describe('Wallet registration Redux module', () => {
  describe('goForward', () => {
    describe('action', () => {
      it('should dispatch the wallet registration action when complete', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({
          registration: {
            complete: true
          }
        })

        const thunk = actions.goForward()

        withStubs([[actions.actions, 'registerWallet', {returns: 'register'}]],
          () => {
            thunk(dispatch, getState)
            expect(dispatch.calls).to.deep.equal([{
              args: [ 'register' ]
            }])
          }
        )
      })

      it('should go to the next page if requested', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({
          registration: {
            complete: false
          }
        })

        const thunk = actions.goForward()

        withStubs([
          [router, 'pushRoute', {returns: 'push'}],
          [helpers, '_getNextURLfromState', {returns: '/next/'}]], () => {
            thunk(dispatch, getState)
            expect(dispatch.calledWithArgs).to.deep.equal(['push'])
            expect(router.pushRoute.calledWithArgs).to.deep.equal(['/next/'])
          }
        )
      })
    })

    describe('_getNextURLFromState()', () => {
// TODO write new tests for modified functionality
    })

    describe('_isComplete()', () => {
      const test = ({invalid, result}) => {
        invalid = new Immutable.Set(invalid)
        expect(helpers._isComplete(Immutable.fromJS({
          username: {valid: !invalid.has('username')},
          passphrase: {valid: !invalid.has('passphrase')}
        }))).to.equal(result)
      }

      it('should return false if nothing is filled in', () => {
        test({
          invalid: [ 'username', 'passphrase' ],
          result: false
        })
      })

      it('should return false if one of the base fields is missing', () => {
        test({invalid: ['username'], result: false})
      })

      it('should return true if nothing is missing', () => {
        test({invalid: [], result: true})
      })
    })

    describe('addEntropyFromDeltas', () => {
      it('should not do anything when phrase is already generated', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({
          registration: {
            passphrase: {phrase: 'xyx'}
          }
        })

        const services = {entropy: {addFromDelta: stub()}}
        const thunk = actions.addEntropyFromDeltas({dx: 5, dy: 3})

        thunk(dispatch, getState, {services})

        expect(services.entropy.addFromDelta.called).to.equal(false)
      })

      it('should add entropy when necessary', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({registration: {
          passphrase: {phrase: ''}
        }})

        const services = {
          entropy: {
            addFromDelta: stub(),
            isReady: stub().returns(false),
            getProgress: stub().returns(0.5),
            getRandomString: stub().returns('bla')
          }
        }

        const thunk = actions.addEntropyFromDeltas({dx: 5, dy: 3})
        thunk(dispatch, getState, {services})

        expect(services.entropy.addFromDelta.called).to.equal(true)
        expect(dispatch.calls).to.deep.equal([{args: [
          actions.setEntropyStatus({
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

        const thunk = actions.addEntropyFromDeltas({ dx: 5, dy: 3 })
        thunk(dispatch, getState, {services})

        expect(services.entropy.addFromDelta.called).to.equal(true)
        expect(services.entropy.getRandomString.called).to.equal(true)
        expect(dispatch.calls).to.deep.equal([
          {args: [actions.setEntropyStatus({
            sufficientEntropy: true,
            progress: 1
          })]},
          {args: [actions.setRandomString({
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
        const readyE = actions.submitEntropy()

        expect(() => { readyE(dispatch, getState) }).to.throw('Not enough entropy!')
        expect(dispatch.calls).to.deep.equal([])
      })

      it('should trigger generateKeyPairs when there is enough entropy', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({registration: {
          passphrase: {sufficientEntropy: true}
        }})
        withStubs([
        [actions.actions, 'generateKeyPairs', {returns: 'generated'}]],
        () => {
          const readyE = actions.actions.submitEntropy()
          readyE(dispatch, getState)
          expect(actions.actions.generateKeyPairs.called).to.equal(true)
        }
      )
      })
    })

    describe('generateKeyPairs', () => {
      it('should not do anything is there is no randomString', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({registration: {
          passphrase: {randomString: ''}
        }})

        const services = {entropy: {
          getHashedEntropy: stub()
        }}

        expect(() => {
          actions.generateKeyPairs()(dispatch, getState, {services})
        }).to.throw('No seedphrase found')
      })

      it('should trigger generateKeyPairs if there is a random string present', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({
          registration: {
            passphrase: {randomString: 'dfghkjdlfgk'}
          }
        })

        const services = {
          entropy: { getHashedEntropy: stub() }
        }

        const generate = actions.generateKeyPairs()
        withStubs([
          [actions.actions.goForward, 'goForward', {returns: 'forward'}],
          [actions.actions.setPassphrase, 'setPassphrase', {returns: 'forward'}]],
          () => {
            generate(dispatch, getState, {services})
            expect(services.entropy.getHashedEntropy.called).to.equal(true)
          }
        )
      })
    })

    describe('registerWallet', () => {
      it('should register with seedphrase', async () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({registration: {
          username: {value: 'usr'},
          passphrase: {phrase: 'bla bla bla'},
          ownURL: {valueOwnURL: 'test'},
          inviteCode: null
        }})
        const services = {
          auth: {
            register: stub().returnsAsync('regSeed'),
            login: stub().returnsAsync({success: true})
          }
        }
        await withStubs([
          [actions.actions, 'goForward', {returns: 'forward'}],
          [actions.actions.registerWallet, 'buildAction',
          {returns: 'action'}]],
          async () => {
            const thunk = actions.registerWallet()
            thunk(dispatch, getState, {services})
            expect(dispatch.calledWithArgs[0]).to.equal('action')
            const registerAction = actions.actions.registerWallet
            const promise = registerAction.buildAction.calledWithArgs[1]

            await promise(services.auth.register)

            // eslint-disable-next-line
            expect(services.auth.register.called).to.be.true
            expect(services.auth.register.calls)
              .to.deep.equal([{
                args: [{
                  seedPhrase: 'bla bla bla',
                  userName: 'usr',
                  inviteCode: null,
                  gatewayUrl: 'test'
                }]
              }])
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
          writtenDown: false,
          valid: false
        })
      })
      it('should correctly update', () => {
        let state = reducer(undefined, '@@INIT')
        state = reducer(state, actions.setEntropyStatus({
          sufficientEntropy: 'bla',
          progress: 0.4
        }))

        expect(state.get('passphrase').toJS())
        .to.deep.equal({
          sufficientEntropy: 'bla',
          progress: 0.4,
          randomString: '',
          phrase: '',
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
          type: actions.registerWallet.id
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
          type: actions.registerWallet.id_success
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
          type: actions.registerWallet.id_fail,
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
