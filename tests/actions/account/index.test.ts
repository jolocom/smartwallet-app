import { accountActions } from 'src/actions/'
import configureStore from 'redux-mock-store'
import data from '../registration/data/mockRegistrationData'
import thunk from 'redux-thunk'
import { JolocomLib } from 'jolocom-lib'

describe('Account action creators', () => {
  const initialState = {
    account: {
      claims: {
        toJS: () => {
          return {
            loading: false,
            selected: {
              credentialType: 'Email',
              claimData: {
                email: 'test@test.com',
              },
              id: '',
              issuer: 'did:jolo:test',
              subject: 'did:jolo:test',
            },
            pendingExternal: [],
            decoratedCredentials: 'blah',
          }
        },
      },
      did: {
        get: () => 'mock:did:test ',
      },
    },
  }
  const mockStore = configureStore([thunk])(initialState)

  beforeEach(() => {
    mockStore.clearActions()
  })

  it('Should correctly handle one existing user identity', async () => {
    const backendMiddleware = {
      storageLib: {
        get: {
          persona: jest.fn().mockResolvedValue([{ did: 'did:jolo:mock' }]),
          encryptedSeed: jest.fn().mockResolvedValue('johnnycryptoseed'),
        },
      },
      keyChainLib: {
        getPassword: jest.fn().mockResolvedValue('sekrit'),
      },
      encryptionLib: {
        decryptWithPass: () => 'newSeed',
      },
      setIdentityWallet: jest.fn(() => Promise.resolve()),
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mockStore.getState, backendMiddleware)

    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly handle more existing user identites', async () => {
    const backendMiddleware = {
      storageLib: {
        get: {
          persona: jest
            .fn()
            .mockResolvedValue([
              { did: 'did:jolo:first' },
              { did: 'did:jolo:second' },
            ]),
          encryptedSeed: jest.fn().mockResolvedValue('johnnycryptoseed'),
        },
      },
      keyChainLib: {
        getPassword: jest.fn().mockResolvedValue('sekrit'),
      },
      encryptionLib: {
        decryptWithPass: () => 'newSeed',
      },
      setIdentityWallet: jest.fn(() => Promise.resolve()),
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mockStore.getState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly handle an empty personas table', async () => {
    const backendMiddleware = {
      storageLib: {
        get: {
          persona: jest.fn().mockResolvedValue([]),
          encryptedSeed: jest.fn().mockResolvedValue('johnnycryptoseed'),
        },
      },
      keyChainLib: {
        getPassword: jest.fn().mockResolvedValue('sekrit'),
      },
      encryptionLib: {
        decryptWithPass: () => 'newSeed',
      },
      setIdentityWallet: jest.fn(() => Promise.resolve()),
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mockStore.getState, backendMiddleware)
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
        },
      },
      identityWallet,
    }

    const action = accountActions.setClaimsForDid()
    await action(mockStore.dispatch, mockStore.getState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('should correctly save claim', async () => {
    const { identityWallet } = data
    const mockClaimsItem = {
      credentialType: 'Email',
      claimData: {
        email: 'test@test',
      },
      issuer: 'did:jolo:test',
      subject: 'did:jolo:test',
    }

    const backendMiddleware = {
      keyChainLib: {
        getPassword: jest.fn().mockResolvedValue('sekrit'),
      },
      storageLib: {
        store: {
          verifiableCredential: jest.fn().mockResolvedValue([]),
        },
      },
      identityWallet,
    }

    const action = accountActions.saveClaim(mockClaimsItem)
    await action(mockStore.dispatch, mockStore.getState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })
})
