import { accountActions } from 'src/actions/'
import data from '../registration/data/mockRegistrationData'
import { JolocomLib } from 'jolocom-lib'
import { RootState } from 'src/reducers'

import { createMockStore } from 'tests/utils'

describe('Account action creators', () => {
  const initialState: Partial<RootState> = {
    registration: {
      loading: {
        loadingMsg: '',
        isRegistering: false,
      },
    },
    account: {
      loading: false,
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
        pendingExternal: {
          offer: [],
          offeror: {
            did: '',
          },
        },
        decoratedCredentials: {},
      },
      did: {
        did: '',
      },
    },
  }

  const mockMiddleware = {
    storageLib: {
      get: {
        persona: jest.fn(),
        encryptedSeed: jest.fn().mockResolvedValue('johnnycryptoseed'),
      },
    },
    keyChainLib: {
      getPassword: jest.fn().mockResolvedValue('sekrit'),
    },
    encryptionLib: {
      decryptWithPass: jest.fn().mockReturnValue('newSeed'),
    },
    setIdentityWallet: jest.fn().mockResolvedValue(null),
    identityWallet: { identity: { did: 'did:jolo:first' } },
  }

  const mockStore = createMockStore(initialState, mockMiddleware)

  beforeEach(mockStore.reset)

  it('Should correctly handle one existing user identity', async () => {
    mockMiddleware.storageLib.get.persona.mockResolvedValueOnce({
      did: 'did:jolo:first',
    })

    await mockStore.dispatch(accountActions.checkIdentityExists)
    expect(mockMiddleware.setIdentityWallet).toHaveBeenCalledTimes(1)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly handle more existing user identities', async () => {
    mockMiddleware.storageLib.get.persona.mockResolvedValueOnce([
      { did: 'did:jolo:first' },
    ])
    await mockStore.dispatch(accountActions.checkIdentityExists)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly handle an empty encrypted seed table', async () => {
    mockMiddleware.storageLib.get.persona.mockResolvedValueOnce([])
    // NOTE: type issue, need to pass a promise into mockReturnValueOnce,
    // because now the type is set to Promise<T> as it is already pre-setup in
    // the mockMiddlerware
    mockMiddleware.storageLib.get.encryptedSeed.mockReturnValueOnce(
      Promise.resolve(null),
    )

    await mockStore.dispatch(accountActions.checkIdentityExists)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly retrieve claims from device storage db on setClaimForDid', async () => {
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
