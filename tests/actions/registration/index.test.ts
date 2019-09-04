import { registrationActions } from 'src/actions'
import data from './data/mockRegistrationData'
import { JolocomLib } from 'jolocom-lib'
import * as util from 'src/lib/util'
import { withErrorScreen } from 'src/actions/modifiers'
import { AppError, ErrorCode } from 'src/lib/errors'
import { routeList } from 'src/routeList'
import { createMockStore } from 'tests/utils'
import { RootState } from 'src/reducers'

const MockDate = require('mockdate')

describe('Registration action creators', () => {
  describe('submitEntropy', () => {
    const mockMiddleware = {
      keyChainLib: {
        savePassword: jest.fn(),
      },
    }
    const mockStore = createMockStore({}, mockMiddleware)

    beforeEach(mockStore.reset)

    it('should correctly navigate to route and provide the entropy', () => {
      const action = registrationActions.submitEntropy('mockEntropy')
      mockStore.dispatch(action)
      expect(mockStore.getActions()).toMatchSnapshot()
    })
  })

  describe('createIdentity', () => {
    it('should attempt to create an identity', async () => {
      MockDate.set(new Date(946681200000))
      const { getPasswordResult, cipher, entropy, identityWallet } = data
      const fuelSpy = jest
        .spyOn(JolocomLib.util, 'fuelKeyWithEther')
        .mockResolvedValueOnce(null)
      const randomPassword = 'hunter0='
      jest
        .spyOn(util, 'generateSecureRandomBytes')
        .mockImplementation(() =>
          Promise.resolve(Buffer.from(randomPassword, 'base64')),
        )
      const mockMiddleware = {
        identityWallet,
        keyChainLib: {
          getPassword: jest.fn().mockResolvedValue(getPasswordResult),
          savePassword: jest.fn(),
        },
        encryptionLib: {
          encryptWithPass: jest.fn().mockReturnValue(cipher),
          decryptWithPass: jest.fn().mockReturnValue(entropy),
        },
        storageLib: {
          store: {
            persona: jest.fn(),
            encryptedSeed: jest.fn(),
            didDoc: jest.fn(),
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

      const mockState: Partial<RootState> = {
        registration: {
          loading: {
            loadingMsg: '',
            isRegistering: false,
          },
        },
      }

      const mockStore = createMockStore(mockState, mockMiddleware)
      await mockStore.dispatch(registrationActions.createIdentity(entropy))

      expect(mockMiddleware.storageLib.store.didDoc).toHaveBeenCalledWith(
        identityWallet.didDocument,
      )
      expect(mockStore.getActions()).toMatchSnapshot()
      expect(mockMiddleware.keyChainLib.savePassword).toHaveBeenCalledTimes(1)
      expect(mockMiddleware.keyChainLib.savePassword).toHaveBeenCalledWith(
        randomPassword,
      )
      expect(
        mockMiddleware.storageLib.store.persona.mock.calls,
      ).toMatchSnapshot()
      expect(
        mockMiddleware.storageLib.store.encryptedSeed.mock.calls,
      ).toMatchSnapshot()
      expect(fuelSpy.mock.calls).toMatchSnapshot()
      MockDate.reset()
    })

    it('should display exception screen in case of error', async () => {
      const mockEntropy = 'abcd'
      const mockMiddleware = {
        keyChainLib: {
          getPassword: jest.fn().mockRejectedValue('MockError'),
        },
      }
      const mockStore = createMockStore({}, mockMiddleware)
      const asyncAction = registrationActions.createIdentity(mockEntropy)

      await mockStore.dispatch(
        withErrorScreen(
          asyncAction,
          err =>
            new AppError(ErrorCode.RegistrationFailed, err, routeList.Landing),
        ),
      )

      const firstAction = mockStore.getActions()[0]
      expect(firstAction.routeName).toContain('Exception')
      expect(firstAction.params.returnTo).toBe('Landing')
    })
  })
})
