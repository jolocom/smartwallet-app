import { accountActions } from 'src/actions/'
import data from './mockRegistrationData'
import { JolocomLib } from 'jolocom-lib'
import { RootState } from 'src/reducers'
import { createMockStore, RecursivePartial } from 'tests/utils'
import { withErrorScreen } from 'src/actions/modifiers'
import { BackendError } from '@jolocom/sdk/js/src/lib/errors/types'

describe('Account action creators', () => {
  const initialState: RecursivePartial<RootState> = {
    generic: {
      locked: false,
      disableLock: false
    },
    registration: {
      loading: {
        loadingMsg: '',
        isRegistering: false,
      },
    },
    settings: {
      locale: 'en',
      seedPhraseSaved: false,
    },
    account: {
      loading: false,
      appState: {
        isLocalAuthSet: false,
        isLocalAuthVisible: false,
        isPopup: false,
        isAppLocked: false,
        isLockVisible: false,
        isPINInstructionVisible: false
      },
      claims: {
        selected: {
          credentialType: 'Email',
          claimData: {
            email: 'test@test.com',
          },
          id: '',
          issuer: {
            did: 'did:jolo:test',
          },
          subject: 'did:jolo:test',
        },
        decoratedCredentials: {},
        hasExternalCredentials: false,
      },
      did: {
        did: 'some did',
      },
    },
  }

  const { identityWallet, testSignedCredentialDefault } = data

  const backendMiddleware = {
    prepareIdentityWallet: jest.fn().mockResolvedValue(identityWallet),
    storageLib: {
      get: {
        verifiableCredential: jest
          .fn()
          .mockResolvedValue([
            JolocomLib.parse.signedCredential(testSignedCredentialDefault),
          ]),
        credentialMetadata: jest.fn().mockResolvedValue({}),
        publicProfile: jest.fn().mockResolvedValue({}),
      },
    },
    identityWallet,
  }

  const mockStore = createMockStore(initialState, backendMiddleware)

  beforeEach(mockStore.reset)

  it('should correctly handle stored encrypted seed', async () => {
    const getGenericPassword = require('react-native-keychain')
      .getGenericPassword
    getGenericPassword.mockReturnValueOnce('MOCK PIN')

    const asyncStorageGetItem: jest.Mock =
      require('@react-native-community/async-storage').default.getItem

    await mockStore.dispatch(accountActions.checkIdentityExists)
    expect(asyncStorageGetItem).toHaveBeenCalledTimes(1)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('should correctly handle an empty encrypted seed table', async () => {
    backendMiddleware.prepareIdentityWallet.mockRejectedValue(
      new BackendError(BackendError.codes.NoEntropy),
    )
    await mockStore.dispatch(accountActions.checkIdentityExists)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('should display exception screen in case of error', async () => {
    backendMiddleware.prepareIdentityWallet.mockRejectedValue(
      new Error('everything is WRONG'),
    )
    await mockStore.dispatch(
      withErrorScreen(accountActions.checkIdentityExists),
    )
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('should correctly retrieve claims from device storage db on setClaimForDid', async () => {
    const { identityWallet, testSignedCredentialDefault } = data

    const backendMiddleware = {
      storageLib: {
        get: {
          verifiableCredential: jest
            .fn()
            .mockResolvedValue([
              JolocomLib.parse.signedCredential(testSignedCredentialDefault),
            ]),
          credentialMetadata: jest.fn().mockResolvedValue({}),
          publicProfile: jest.fn().mockResolvedValue({}),
        },
      },
      identityWallet,
    }

    const altMockStore = createMockStore(initialState, backendMiddleware)

    await altMockStore.dispatch(accountActions.setClaimsForDid)
    expect(altMockStore.getActions()).toMatchSnapshot()
  })

  it('should correctly save claim', async () => {
    const { identityWallet } = data

    const backendMiddleware = {
      keyChainLib: {
        getPassword: jest.fn().mockResolvedValue('sekrit'),
      },
      storageLib: {
        store: {
          verifiableCredential: jest.fn().mockResolvedValue([]),
        },
        get: {
          verifiableCredential: jest.fn().mockResolvedValue([]),
          publicProfile: jest.fn().mockReturnValue({}),
        },
      },
      identityWallet,
    }

    const altMockStore = createMockStore(initialState, backendMiddleware)

    await altMockStore.dispatch(accountActions.saveClaim)
    expect(altMockStore.getActions()).toMatchSnapshot()
  })
})
