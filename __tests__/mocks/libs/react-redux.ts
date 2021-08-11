import * as rredux from 'react-redux'

type MockedStore = Record<string, string> | MockedStore

export function mockSelectorReturn(mockedStore: MockedStore) {
  // @ts-expect-error
  rredux.useSelector.mockImplementation((callback: (state: any) => void) =>
    callback(mockedStore),
  )
}

export const getMockedDispatch = () => {
  const mockDispatchFn = jest.fn()
  const useDispatchSpy = jest.spyOn(rredux, 'useDispatch')
  useDispatchSpy.mockReturnValue(mockDispatchFn)
  return mockDispatchFn
}
