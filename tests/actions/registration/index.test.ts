import { registrationActions } from 'src/actions'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import data from './data/mockRegistrationData'
import { JolocomLib } from 'jolocom-lib'
import { getJestConfig } from 'ts-jest/dist/test-utils'
import * as util from 'src/lib/util'

const MockDate = require('mockdate')

describe('Registration action creators', () => {
  describe('startRegistration', () => {
    const mockGetState = () => {}

    it('should display exception screen in case of error', async () => {
      const mockStore = configureStore([thunk])({})
      const mockMiddleware = {
        keyChainLib: {
          savePassword: jest.fn().mockRejectedValue({
            message: 'password could not be saved',
            stack: 'mock start registration error stack',
          }),
        },
      }

      const asyncAction = registrationActions.startRegistration()
      await asyncAction(mockStore.dispatch, mockGetState, mockMiddleware)

      expect(mockStore.getActions()[0].routeName).toContain('Exception')
      expect(mockStore.getActions()[0].params.returnTo).toBe('Landing')
    })

    it('should save a password and create an identity', async () => {
      MockDate.set(new Date(946681200000))
      const { getPasswordResult, entropy, identityWallet } = data
      const entropyBytes = Buffer.from(entropy, 'hex')
      const randomPasswordBytes = Buffer.from('hunter2')
      util.generateSecureRandomBytes = length => {
        if (length == 32) return randomPasswordBytes
        else if (length == 16) return entropyBytes
      }
      JolocomLib.util.fuelKeyWithEther = jest.fn()
      const mockBackend = {
        identityWallet,
        keyChainLib: {
          savePassword: jest.fn(),
          getPassword: jest.fn().mockResolvedValue(getPasswordResult),
        },
        storageLib: {
          store: {
            persona: jest.fn(),
            seedEncrypted: jest.fn(),
          },
          get: {
            persona: jest.fn().mockResolvedValue([{ did: 'did:jolo:first' }]),
            encryptedSeed: jest.fn().mockResolvedValue('johnnycryptoseed'),
          },
        },
        registry: {
          create: () => identityWallet,
        },
        setIdentityWallet: jest.fn(() => Promise.resolve()),
      }

      const mockStore = configureStore([thunk.withExtraArgument(mockBackend)])(
        {},
      )

      const mockGetState = () => {}

      const asyncAction = registrationActions.startRegistration()
      await asyncAction(mockStore.dispatch, mockGetState, mockBackend)
      expect(mockBackend.keyChainLib.savePassword).toHaveBeenCalledTimes(1)
      expect(mockBackend.keyChainLib.savePassword).toHaveBeenCalledWith(
        randomPasswordBytes.toString('base64'),
      )

      expect(mockStore.getActions()).toMatchSnapshot()

      expect(mockBackend.keyChainLib.getPassword).toHaveBeenCalledTimes(1)
      expect(
        mockBackend.storageLib.store.seedEncrypted.mock.calls,
      ).toMatchSnapshot()
      expect(mockBackend.storageLib.store.persona.mock.calls).toMatchSnapshot()
      expect(JolocomLib.util.fuelKeyWithEther.mock.calls).toMatchSnapshot()

      MockDate.reset()
    })
  })

  describe('createIdentity', () => {
    it('should display exception screen in case of error', async () => {
      const mockEntropy = 'abcd'
      const mockBackend = {
        keyChainLib: {
          getPassword: jest.fn().mockRejectedValue('MockError'),
        },
      }

      const mockStore = configureStore([thunk])({})
      const mockGetState = () => {}

      const asyncAction = registrationActions.createIdentity(mockEntropy)
      await asyncAction(mockStore.dispatch, mockGetState, mockBackend)

      expect(mockStore.getActions()[0].routeName).toContain('Exception')
      expect(mockStore.getActions()[0].params.returnTo).toBe('Landing')
    })
  })
})
