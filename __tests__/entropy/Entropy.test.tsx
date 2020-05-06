import { useEntropyProgress } from '~/screens/LoggedOut/entropy'
import { renderHook, act } from '@testing-library/react-hooks'

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}))

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}))

describe('Entropy', () => {
  it('should match snapshot after adding a point to the canvas', () => {
    const mockSubmit = jest.fn()
    const { result } = renderHook(() => useEntropyProgress(mockSubmit))
    const { addPoint, entropyGenerator } = result.current
    jest.spyOn(entropyGenerator, 'addFromDelta')

    act(() => {
      addPoint(100, 300)
    })

    expect(entropyGenerator.addFromDelta).toBeCalledTimes(2)
    expect(result.current.entropyProgress).toMatchSnapshot()
  })

  it('should successfully increment progress after adding a line', () => {
    const mockSubmit = jest.fn()
    const { result } = renderHook(() => useEntropyProgress(mockSubmit))
    const { addPoint, entropyGenerator } = result.current
    jest.spyOn(entropyGenerator, 'addFromDelta')

    act(() => {
      addPoint(100, 300)
      addPoint(200, 500)
      addPoint(400, 200)
    })

    expect(entropyGenerator.addFromDelta).toBeCalledTimes(6)
    expect(result.current.entropyProgress).toMatchSnapshot()
  })

  it('should successfully generate the entropy', () => {
    const mockSubmit = jest.fn()
    const { result } = renderHook(() => useEntropyProgress(mockSubmit))
    const { addPoint } = result.current

    const randomCoord = () => Math.floor(Math.random() * Math.floor(500))
    act(() => {
      for (let i = 0; i < 200; i++) addPoint(randomCoord(), randomCoord())
    })

    expect(result.current.entropyProgress).toMatchSnapshot()
    expect(mockSubmit).toBeCalled
  })
})
