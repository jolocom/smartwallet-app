/* global describe: true, it: true */
import { expect } from 'chai'
import Immutable from 'immutable'
// eslint-disable-next-line
import { actions, helpers } from './registration'
import router from './router'
import {stub, withStubs} from '../../../../test/utils'
// eslint-disable-next-line
import reducer from './registration'

describe('Wallet registration Redux module', () => {
  describe.only('goForward', () => {
    describe('action', () => {
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
        })
      })
    })

    describe('_getNextURLFromState()', () => {
// TODO write new tests for modified functionality
    })

    describe('_isComplete()', () => {
      const test = ({invalid, result}) => {
        invalid = new Immutable.Set(invalid)
        expect(helpers._isComplete(Immutable.fromJS({
          passphrase: {valid: !invalid.has('passphrase')}
        }))).to.equal(result)
      }

      it('should return false if nothing is filled in', () => {
        test({
          invalid: [ 'passphrase' ],
          result: false
        })
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
        expect(() => {
          readyE(dispatch, getState)
        }).to.throw('Not enough entropy!')

        expect(dispatch.calls).to.deep.equal([])
      })

      it('should trigger generateSeedPhrase when there is enough entropy', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({registration: {
          passphrase: {sufficientEntropy: true}
        }})
        withStubs([
          [actions.actions, 'generateSeedPhrase', {returns: 'generated'}]
        ], () => {
          const readyE = actions.actions.generateSeedPhrase
          readyE(dispatch, getState)
          expect(actions.actions.generateSeedPhrase.called).to.equal(true)
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

        expect(() => {
          actions.generateAndEncryptKeyPairs()(dispatch, getState, {})
        }).to.throw('No seedphrase found')
      })

      // eslint-disable-next-line
      it('should trigger generateAndEcryptKeyPairs if there is a seed present', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({
          registration: {
            passphrase: {
              phrase: 'mnemonic phrase'
            }
          }
        })

        const backend = {
          encryption: { 
            encryptInformation: stub()
          }
        }
        
        const thunk = actions.generateAndEncryptKeyPairs()
        thunk(dispatch, getState, {backend})
        console.log(JSON.stringify(dispatch.calls))
        expect(backend.encryption.encryptInformation.called).to.equal(true)
      })
    })

    describe('setEntropyStatus', () => {
      it('should correctly initialize', () => {
        let state = reducer(undefined, '@@INIT')

        expect(state.get('passphrase').toJS())
        .to.deep.equal({
          sufficientEntropy: false,
          progress: 0,
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
          phrase: '',
          writtenDown: false,
          valid: false
        })
      })
    })
    it('should update correct state based on key (pass/passReenter)', () => {
      let state = reducer(undefined, '@@INIT')

      const actionCheckPassword = {
        type: actions.checkPassword.id,
        fieldName: 'passReenter',
        password: 'testPasswordNatascha1'
      }
      state = reducer(state, actionCheckPassword)
      const expectedState = {
        maskedImage: {
          uncovering: false
        },
        passphrase: {
          sufficientEntropy: false,
          progress: 0,
          phrase: '',
          writtenDown: false,
          valid: false
        },
        encryption: {
          loading: false,
          pass: '',
          passReenter: 'testPasswordNatascha1',
          errorMsg: '',
          generatedAndEncrypted: false,
          status: ''
        },
        complete: false
      }
      expect(state.toJS()).to.deep.equal(expectedState)
    })
  })
})
