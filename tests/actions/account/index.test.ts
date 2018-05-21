import { accountActions } from 'src/actions/'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe.only('Account action creators', () => {
  const mockStore = configureStore([thunk])({})
  const mocKGetState = () => {}

  beforeEach(() => {
    mockStore.clearActions()
  })

  it('Should correctly handle one existing user identity', async () => {
    const backendMiddleware = {
      storageLib: {
        getPersonas: jest.fn().mockResolvedValue([{did: 'did:jolo:mock'}])
      }
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mocKGetState, backendMiddleware)

    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly handle more existing user identites', async () => {
    const backendMiddleware = {
      storageLib: {
        getPersonas: jest.fn().mockResolvedValue([
          { did: 'did:jolo:first' },
          { did: 'did:jolo:second' }
        ])
      }
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mocKGetState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly handle an empty personas table', async() => {
    const backendMiddleware = {
      storageLib: {
        getPersonas: jest.fn().mockResolvedValue([])
      }
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mocKGetState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly handle an "no such table" error being thrown', async () => {
    const mockError = new Error('no such table')
    const backendMiddleware = {
      storageLib: {
        getPersonas: jest.fn().mockRejectedValue(mockError)
      }
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mocKGetState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('Should correctly handle an arbitrary error being thrown', async () => {
    const mockError = { message: 'gamma rays have flipped our bits!' }
    const backendMiddleware = {
      storageLib: {
        getPersonas: jest.fn().mockRejectedValue(mockError)
      }
    }

    const action = accountActions.checkIdentityExists()
    await action(mockStore.dispatch, mocKGetState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  // it('Should correctly retrieve claims from device storage db', () => {
  //
  // })
})
