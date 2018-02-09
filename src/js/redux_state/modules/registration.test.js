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

        const services = {
          entropy: {
            addFromDelta: stub(),
            isReady: stub().returns(true),
            getProgress: stub().returns(1),
            getRandomString: stub().returns('you did your homework')
          }
        }

        const thunk = actions.addEntropyFromDeltas({ dx: 5, dy: 3 })

        withStubs([], () => {
          thunk(dispatch, getState, {services})

          expect(services.entropy.addFromDelta.called).to.equal(true)
          expect(services.entropy.getRandomString.called).to.equal(true)
          expect(dispatch.calls).to.deep.equal([{
            args: [{
              type: 'registration/SET_ENTROPY_STATUS',
              sufficientEntropy: true,
              progress: 1
            }]
          }, {
            args: [{
              randomString: 'you did your homework',
              type: 'registration/SET_RANDOM_STRING'
            }]
          }])
        })
      })
    })

    describe('generateKeyPairs', () => {
      it('should not do anything is there is no randomString', async () => {
        const dispatch = stub()
        const getState = () => Immutable.fromJS({
          passphrase: {
            randomString: ''
          }
        })

        const promise = actions.generateAndEncryptKeyPairs()
        await expect(promise(dispatch, getState, {}))
          .to.be.rejectedWith('No random string provided')
      })

      it('should execute correctly if seed is set', async () => {
        // eslint-disable-next-line
        const pKey = 'ABF82FF96B463E9D82B83CB9BB450FE87E6166D4DB6D7021D0C71D7E960D5ABE'
        const address = '0x959fd7ef9089b7142b6b908dc3a8af7aa8ff0fa1'
        const mockWIF = 'L2yznSPTTv5yoB8mDDtzNnEtTunvsUJnRCbzzupV4tMZ4uWUPRrB'
        const mockRandString = '13912643311766764847120568039921'

        const dispatch = stub()

        const getState = () => Immutable.fromJS({
          registration: {
            passphrase: {
              randomString: mockRandString
            },
            encryption: {
              pass: 'password'
            }
          }
        })

        const backend = {
          ethereum: {
            requestEther: stub()
          },
          encryption: {
            encryptInformation: stub().returns('encryptedData')
          },
          jolocomLib: {
            identity: {
              create: stub().returns({
                ethereumKeyWIF: mockWIF,
                genericSigningKeyWIF: 'genericKeyWIF',
                masterKeyWIF: 'masterKeyWIF',
                mnemonic: 'bean matrix move',
                didDocument: {id: 'did'}
              }),
              store: stub().returns('mockIpfsHash'),
              register: stub()
            }
          }
        }

        const services = {
          storage: { setItem: stub() }
        }

        const promise = actions.generateAndEncryptKeyPairs()
        await promise(dispatch, getState, {services, backend})

        const expectedCreationCalls = [{
          args: [ '13912643311766764847120568039921' ]
        }]

        expect(backend.jolocomLib.identity.create.calls)
          .to.deep.equal(expectedCreationCalls)

        const expectedEthRequestCalls = [{
          args: [{
            address,
            did: undefined
          }]
        }]

        expect(backend.ethereum.requestEther.calls)
          .to.deep.equal(expectedEthRequestCalls)

        const expectedIpfsStorageCalls = [{
          args: [ {id: 'did'} ]
        }]

        expect(backend.jolocomLib.identity.store.calls)
          .to.deep.equal(expectedIpfsStorageCalls)

        const expectedEthRegisterCalls = [{
          args: [Buffer.from(pKey, 'hex'), 'did', 'mockIpfsHash']
        }]

        expect(backend.jolocomLib.identity.register.calls)
          .to.deep.equal(expectedEthRegisterCalls)

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

        expect(backend.encryption.encryptInformation.calls)
          .to.deep.equal(expectedEncryptionCalls)

        const expectedStorageCalls = [{
          args: ['masterKeyWIF', 'encryptedData']
        }, {
          args: ['genericKeyWIF', 'encryptedData']
        }]

        expect(services.storage.setItem.calls)
          .to.deep.equal(expectedStorageCalls)

        /*
        const expectedDispatchCalls = [{
          args: [{
            randomString: '',
            type: 'registration/SET_RANDOM_STRING'
          }]
        }, {
          args: [{
            mnemonic: 'bean matrix move',
            type: 'registration/SET_PASSPHRASE'
          }]
        }]

        expect(dispatch.calls)
          .to.deep.equal(expectedDispatchCalls)
        */
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
          randomString: '',
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
        progress: {
          loading: false,
          loadingMsg: ''
        },
        complete: false
      }
      expect(state.toJS()).to.deep.equal(expectedState)
    })
  })
})
