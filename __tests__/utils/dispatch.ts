import * as redux from 'react-redux'

export const getMockedDispatch = () => {
  const mockDispatchFn = jest.fn()
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(mockDispatchFn)
  return mockDispatchFn
}
