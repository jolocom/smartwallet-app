import { accountActions } from 'src/actions/'
import configureStore from 'redux-mock-store'
import data from '../registration/data/mockRegistrationData'
import thunk from 'redux-thunk'
import { JolocomLib } from 'jolocom-lib'

describe('Account action creators', () => {
  const initialState = {
    account: {
      claims: {
        toJS: () => { return {
          loading: false,
          selected: {
            displayName: '',
            type: ['', ''],
            claims: []
          },
          decoratedCredentials: 'blah'
          }
        }
      },
      did: {
        get: () => 'mock:did:test '
      }
    }
  }
  const mockStore = configureStore([thunk])(initialState)
  
  beforeEach(() => {
    mockStore.clearActions()
  })

  it('Should correctly handle one existing user identity', async () => {
    const backendMiddleware = {
      storageLib: { 
        get: {
          persona: jest.fn().mockResolvedValue([{did: 'did:jolo:mock'}])
        }
      }
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mockStore.getState, backendMiddleware)

    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly handle more existing user identites', async () => {
    const backendMiddleware = {
      storageLib: {
        get: {
          persona: jest.fn().mockResolvedValue([
            { did: 'did:jolo:first' },
            { did: 'did:jolo:second' }
          ])
        }
      }
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mockStore.getState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly handle an empty personas table', async() => {
    const backendMiddleware = {
      storageLib: {
        get: {
          persona: jest.fn().mockResolvedValue([])
        }
      }
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mockStore.getState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  // it('Should correctly handle an arbitrary error being thrown', async () => {
  //   const mockError = { message: 'gamma rays have flipped our bits!' }
  //   const backendMiddleware = {
  //     storageLib: {
  //       get: {
  //         persona: jest.fn().mockRejectedValue(mockError)
  //       }
  //     }
  //   }

  //   const action = accountActions.checkIdentityExists()
  //   await action(mockStore.dispatch, mockStore.getState, backendMiddleware)
  //   expect(mockStore.getActions()[1].params.errorMessage).toContain('gamma rays have flipped our bits!')
  // })


  it('Should correctly retrieve claims from device storage db on setClaimForDid', async () => {
    const { identityWallet, mockVCred } = data
    
    const backendMiddleware = {
      storageLib: {
        get: {
          verifiableCredential: jest.fn()
            .mockResolvedValue([JolocomLib.parse.signedCredential.fromJSON(mockVCred)])
        }
      },
      identityWallet
    }

    const action = accountActions.setClaimsForDid()
    await action(mockStore.dispatch, mockStore.getState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('should correctly save claim', async () => {
    const { identityWallet } = data
    const mockClaimsItem = {
      displayName: 'E-mail',
      type: ['Credential', 'ProofOfEmailCredential'],
      claims: [{
        name: 'email',
        value: 'test@test'
      }]
    }
    const backendMiddleware = {
      storageLib: {
        store: {
          verifiableCredential: jest.fn().mockResolvedValue([])
        } 
      },
      identityWallet
    }
    
    const action = accountActions.saveClaim(mockClaimsItem)
    await action(mockStore.dispatch, mockStore.getState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })  
})
