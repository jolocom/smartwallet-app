import {
  default as originalCreateMockStore,
  MockStoreEnhanced,
} from 'redux-mock-store'
import thunk from 'redux-thunk'

import { BackendMiddleware } from 'src/backendMiddleware'
import { stub, RecursivePartial } from 'tests/utils/stub'
import { RootState } from 'src/reducers'
import { ThunkDispatch } from 'src/store'
import { AnyAction } from 'redux'

interface MockStoreWithMockBackend
  extends MockStoreEnhanced<RootState, ThunkDispatch> {
  reset: () => void
  backendMiddleware: BackendMiddleware
}

export function createMockStoreWithReducers(
  initialState?: RecursivePartial<RootState>,
  backendMiddlewareStub: RecursivePartial<BackendMiddleware> = {},
) {
  const { rootReducer } = require('src/reducers')
  if (!initialState) initialState = rootReducer(undefined, { type: '@INIT' })
  let getState = (actions: AnyAction[]) => {
    return actions.reduce(
      (accm, action) => rootReducer(accm, action),
      initialState,
    ) as RootState
  }
  return createMockStore(getState, backendMiddlewareStub)
}

export function createMockStore(
  initialState: RecursivePartial<RootState> | ((actions: AnyAction[]) => RootState) = {},
  backendMiddlewareStub: RecursivePartial<BackendMiddleware> = {},
) {
  const mockBackendMiddleware = stub<BackendMiddleware>(backendMiddlewareStub)
  const mockStore = originalCreateMockStore<RootState, ThunkDispatch>([
    thunk.withExtraArgument(mockBackendMiddleware),
  ])(initialState as RootState) as MockStoreWithMockBackend

  mockStore.reset = () => {
    mockStore.clearActions()
    stub.clearMocks(mockBackendMiddleware)
  }

  mockStore.backendMiddleware = mockBackendMiddleware

  return mockStore
}
