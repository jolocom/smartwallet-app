import { registrationActions } from 'src/actions'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import data from './data/mockRegistrationData'

describe('Registration action creators', () => {
  describe('createIdentity', () => {
    it('should attempt to create an identity', async () => {
      const mockStore = configureStore([thunk])({})

      const {didDocument, mnemonic, genericSigningKey, ethereumKey} = data
      const mockCreationResults = {
        didDocument,
        mnemonic,
        genericSigningKey,
        ethereumKey
      }

      const {ipfsHash, decodedWif, getPasswordResult, cipher, entropy} = data
      const mockMiddleware = {
        jolocomLib: {
          identity: {
            create: jest.fn().mockResolvedValue(mockCreationResults),
            store: jest.fn().mockResolvedValue(ipfsHash),
            register: jest.fn()
          }
        },
        ethereumLib: {
          wifToEthereumKey: jest.fn().mockReturnValue(decodedWif),
          requestEther: jest.fn()
        },
        keyChainLib: {
          getPassword: jest.fn().mockResolvedValue(getPasswordResult)
        },
        encryptionLib: { encryptWithPass: jest.fn().mockReturnValue(cipher)},
        storageLib: {
          addMasterKey: jest.fn(),
          addDerivedKey: jest.fn(),
          addPersona: jest.fn()
        },
      }

      const mockGetState = () => {}

      const asyncAction = registrationActions.createIdentity(entropy)
      await asyncAction(mockStore.dispatch, mockGetState, { backendMiddleware: mockMiddleware })

      expect(mockStore.getActions()).toMatchSnapshot()

      expect(mockMiddleware.keyChainLib.getPassword).toHaveBeenCalledTimes(1)
      expect(mockMiddleware.jolocomLib.identity.create.mock.calls).toMatchSnapshot()
      expect(mockMiddleware.encryptionLib.encryptWithPass.mock.calls).toMatchSnapshot()
      expect(mockMiddleware.storageLib.addDerivedKey.mock.calls).toMatchSnapshot()
      expect(mockMiddleware.storageLib.addPersona.mock.calls).toMatchSnapshot()
      expect(mockMiddleware.storageLib.addMasterKey.mock.calls).toMatchSnapshot()
      expect(mockMiddleware.ethereumLib.wifToEthereumKey.mock.calls).toMatchSnapshot()
      expect(mockMiddleware.ethereumLib.requestEther.mock.calls).toMatchSnapshot()
      expect(mockMiddleware.jolocomLib.identity.register.mock.calls).toMatchSnapshot()
    })
  })
})
