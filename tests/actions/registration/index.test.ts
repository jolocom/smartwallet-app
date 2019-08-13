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
    const mockStore = createMockStore({}, {})

    beforeEach(mockStore.reset)

    it('should correctly navigate to route and provide the entropy', () => {
      const action = registrationActions.submitEntropy('mockEntropy')
      mockStore.dispatch(action)
      expect(mockStore.getActions()).toMatchSnapshot()
    })
  })

  describe('recoverIdentity', () => {
    it('should attempt tp recover an identity', async () => {
      MockDate.set(new Date(946681200000))
      const { identityWallet, mnemonic } = data
      const randomPassword = 'hunter0='
      jest
        .spyOn(util, 'generateSecureRandomBytes')
        .mockImplementation(() =>
          Promise.resolve(Buffer.from(randomPassword, 'base64')),
        )

      const mockMiddleware = {
        identityWallet,
        keyChainLib: {
          savePassword: jest.fn(),
        },
        storageLib: {
          store: {
            persona: jest.fn(),
            derivedKey: jest.fn(),
            encryptedSeed: jest.fn(),
            setting: jest.fn(),
          },
        },
        authenticate: () => identityWallet,
      }
      const mockStore = createMockStore({}, mockMiddleware)

      await mockStore.dispatch(registrationActions.recoverIdentity(mnemonic))
      expect(mockStore.getActions()).toMatchSnapshot()

      expect(
        mockMiddleware.keyChainLib.savePassword.mock.calls,
      ).toMatchSnapshot()
      expect(
        mockMiddleware.storageLib.store.persona.mock.calls,
      ).toMatchSnapshot()

      expect(
        mockMiddleware.storageLib.store.encryptedSeed.mock.calls,
      ).toMatchSnapshot()
      MockDate.reset()
    })

    it('should show error screen if DID is not anchored', async () => {
      const { mnemonic } = data
      const mockMiddleware = {
        authenticate: jest.fn().mockRejectedValue('MockError'),
      }
      const mockStore = createMockStore({}, mockMiddleware)

      await mockStore.dispatch(
        withErrorScreen(
          registrationActions.recoverIdentity(mnemonic),
          err =>
            new AppError(
              ErrorCode.IdentityNotAnchored,
              err,
              routeList.InputSeedPhrase,
            ),
        ),
      )

      const firstAction = mockStore.getActions()[0]
      expect(firstAction.routeName).toContain('Exception')
      expect(firstAction.params.returnTo).toBe('InputSeedPhrase')
    })
  })

  describe('createIdentity', () => {
    it('should attempt to create an identity', async () => {
      MockDate.set(new Date(946681200000))
      const { entropy, identityWallet } = data
      const randomPassword = 'hunter0='
      const fuelSpy = jest
        .spyOn(JolocomLib.util, 'fuelKeyWithEther')
        .mockResolvedValueOnce(null)

      jest
        .spyOn(util, 'generateSecureRandomBytes')
        .mockImplementation(() =>
          Promise.resolve(Buffer.from(randomPassword, 'base64')),
        )

      const mockMiddleware = {
        identityWallet,
        keyChainLib: {
          savePassword: jest.fn(),
        },
        storageLib: {
          store: {
            persona: jest.fn(),
            encryptedSeed: jest.fn(),
          },
        },
        registry: {
          create: () => identityWallet,
        },
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

      expect(mockStore.getActions()).toMatchSnapshot()
      expect(
        mockMiddleware.keyChainLib.savePassword.mock.calls,
      ).toMatchSnapshot()
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

      await mockStore.dispatch(
        withErrorScreen(
          registrationActions.createIdentity(mockEntropy),
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
