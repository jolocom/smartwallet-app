import React from 'react'
import {
  useCanvasGestures,
  MAX_LINE_PTS,
  EntropyCanvas,
} from '~/screens/LoggedOut/Onboarding/Registration/Entropy/EntropyCanvas'
import { renderHook, act } from '@testing-library/react-hooks'
import { render } from '@testing-library/react-native'

describe('Entropy Canvas', () => {
  const addPoint = jest.fn()

  const assembleEvent = (x: number, y: number): any => ({
    nativeEvent: {
      locationX: x,
      locationY: y,
    },
  })

  beforeEach(() => jest.clearAllMocks())

  it('should successfully match snapshot on inital render', () => {
    const props = {
      addPoint: jest.fn(),
      disabled: false,
    }
    const { baseElement } = render(<EntropyCanvas {...props} />)

    expect(baseElement).toMatchSnapshot()
  })

  it('should correctly initialize the canvas hook', () => {
    const { result } = renderHook(() => useCanvasGestures(addPoint))
    const { pathEls, pathDs, circles } = result.current

    expect(pathEls).toEqual(new Array(10))
    expect(pathDs.current).toEqual(new Array(10).fill(''))
    expect(circles).toEqual([])
  })

  it('should correctly handle starting drawing', () => {
    const { result } = renderHook(() => useCanvasGestures(addPoint))
    const { pathDs, handleDrawStart } = result.current

    const x = 120,
      y = 320

    act(() => handleDrawStart(assembleEvent(x, y)))
    expect(addPoint).toBeCalledTimes(1)
    expect(pathDs.current[0]).toEqual(`M${x},${y}`)
  })

  it('should correctly continue drawing the path', () => {
    const { result } = renderHook(() => useCanvasGestures(addPoint))
    const { pathDs, handleDrawStart, handleDraw } = result.current

    const x0 = 120,
      y0 = 320,
      x1 = 130,
      y1 = 250

    act(() => {
      handleDrawStart(assembleEvent(x0, y0))
      handleDraw(assembleEvent(x1, y1))
    })

    expect(addPoint).toBeCalledTimes(2)
    expect(pathDs.current[0]).toEqual(`M${x0},${y0}L${x1},${y1}`)
  })

  it('should not modify the path if the line is too short', () => {
    const { result } = renderHook(() => useCanvasGestures(addPoint))
    const { pathDs, handleDrawStart, handleDraw } = result.current

    const x0 = 120,
      y0 = 320,
      x1 = 130,
      y1 = 330

    act(() => {
      handleDrawStart(assembleEvent(x0, y0))
      handleDraw(assembleEvent(x1, y1))
    })

    expect(pathDs.current[0]).toEqual(`M${x0},${y0}`)
  })

  it('should create a new path if there are too many lines', () => {
    const { result } = renderHook(() => useCanvasGestures(addPoint))
    const { pathDs, handleDrawStart, handleDraw } = result.current

    const x0 = 120,
      y0 = 320

    const drawCircle = (
      radius: number,
      x: number,
      y: number,
      steps: number,
    ) => {
      const coord = []
      for (let i = 0; i < steps; i++) {
        coord[i] = {
          x: x + radius * Math.cos((2 * Math.PI * i) / steps),
          y: y + radius * Math.sin((2 * Math.PI * i) / steps),
        }
      }

      return coord
    }

    act(() => {
      handleDrawStart(assembleEvent(x0, y0))
      drawCircle(200, x0, y0, MAX_LINE_PTS + 1).map((point) => {
        handleDraw(assembleEvent(point.x, point.y))
      })
    })

    expect(pathDs.current[1].length).toBeGreaterThan(1)
    expect(result.current.circles).toEqual([])
  })

  it('should successfully return circle coordinates on intersection', () => {
    const { result } = renderHook(() => useCanvasGestures(addPoint))
    const { handleDrawStart, handleDraw } = result.current

    const line0 = [
      { x: 124, y: 496 },
      { x: 189, y: 308 },
    ]
    const line1 = [
      { x: 189, y: 308 },
      { x: 123, y: 496 },
    ]

    const line2 = [
      { x: 209, y: 521 },
      { x: 75, y: 360 },
    ]

    act(() => {
      handleDrawStart(assembleEvent(line0[0].x, line0[0].y))
      handleDraw(assembleEvent(line0[1].x, line0[1].y))
      handleDraw(assembleEvent(line1[0].x, line1[0].y))
      handleDraw(assembleEvent(line1[1].x, line1[1].y))
      handleDraw(assembleEvent(line2[0].x, line2[0].y))
      handleDraw(assembleEvent(line2[1].x, line2[1].y))
    })

    expect(result.current.circles[0].map(Math.floor)).toEqual([142, 441])
  })
})
