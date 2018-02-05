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
  describe('goForward', () => {
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

      it('should get and submit the randomString when entropy is ready', () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({registration: {
          passphrase: {phrase: ''}
        }})
        const services = {entropy: {
          addFromDelta: stub(),
          isReady: stub().returns(true),
          getProgress: stub().returns(1),
          getRandomString: stub().returns('you did your homework')
        }}
        const thunk = actions.addEntropyFromDeltas({ dx: 5, dy: 3 })

        withStubs([
        [actions.actions, 'submitEntropy', {returns: 'i still need to do mine'}]
        ], () => {
          thunk(dispatch, getState, {services})
          expect(services.entropy.addFromDelta.called).to.equal(true)
          expect(services.entropy.getRandomString.called).to.equal(true)
          expect(dispatch.calledWithArgs).to.deep.equal(
            ['i still need to do mine'])
          expect(dispatch.calls).to.deep.equal([
            {args: [{
              type: 'registration/SET_ENTROPY_STATUS',
              sufficientEntropy: true,
              progress: 1
            }]
            },
            {
              args: ['i still need to do mine']
            }
          ])
        })
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

      it('should call generateSeedPhrase when there is enough entropy', () => {
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
      it('should not do anything is there is no randomString', async () => {
        const dispatch = stub()
        const promise = actions.generateAndEncryptKeyPairs()
        await expect(promise(dispatch, {}, {}))
          .to.be.rejectedWith('No random string provided')
      })

      it('should execute correctly if seed is set', async () => {
        const dispatch = stub()
        const randomString = '13912643311766764847120568039921'

        const getState = () => Immutable.fromJS({
          registration: {
            encryption: {
              pass: 'password'
            }
          }
        })

        const services = {
          storage: { setItem: stub() }
        }

        const backend = {
          encryption: { encryptInformation: stub().returns('encrypted') },
          jolocomLib: {
            identity: {
              create: stub().returns({
                ethereumKeyWIF: 'ethereumKeyWIF',
                genericSigningKeyWIF: 'genericKeyWIF',
                masterKeyWIF: 'masterKeyWIF',
                mnemonic: 'bean matrix move'
              })
            }
          }
        }

        const promise = actions.generateAndEncryptKeyPairs(randomString)
        await promise(dispatch, getState, {services, backend})

        const expectedStorageCalls = [{
          args: ['masterKeyWIF', 'encrypted']
        }, {
          args: ['genericKeyWIF', 'encrypted']
        }]

        const expectedEncryptionCalls = [{
          args: [{
            password: 'password',
            data: 'masterKeyWIF'
          }]
        }, {
          args: [{
            password: 'password',
            data: 'genericKeyWIF'
          }]
        }]

        const expectedCreationCalls = [{
          args: [ '13912643311766764847120568039921' ]
        }]

        expect(backend.jolocomLib.identity.create.calls)
          .to.deep.equal(expectedCreationCalls)
        expect(services.storage.setItem.calls)
          .to.deep.equal(expectedStorageCalls)
        expect(backend.encryption.encryptInformation.calls)
          .to.deep.equal(expectedEncryptionCalls)
      })
    })

    describe('publishDDO', () => {
      it('should attempt to publish the DDO to ipfs', async () => {
        const dispatch = stub()
        const getState = {}
        const services = {}
        const backend = {}

        const promise = actions.publishDDO()
        await promise(dispatch, getState, {services, backend})
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
