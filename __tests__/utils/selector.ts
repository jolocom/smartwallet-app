import { useSelector } from 'react-redux'

type MockedStore = Record<string, string> | MockedStore

export function mockSelectorReturn(mockedStore: MockedStore) {
  // @ts-expect-error
  useSelector.mockImplementation((callback: (state: any) => void) => {
    return callback(mockedStore)
  })
}
