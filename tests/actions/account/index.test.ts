import { accountActions } from 'src/actions/'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('Account action creators', () => {
  const mockStore = configureStore([thunk])({})
  const mockGetState = () => {}

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
    await action(mockStore.dispatch, mockGetState, backendMiddleware)

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
    await action(mockStore.dispatch, mockGetState, backendMiddleware)
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
    await action(mockStore.dispatch, mockGetState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly handle an arbitrary error being thrown', async () => {
    const mockError = { message: 'gamma rays have flipped our bits!' }
    const backendMiddleware = {
      storageLib: {
        get: {
          persona: jest.fn().mockRejectedValue(mockError)
        }
      }
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mockGetState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })
})
