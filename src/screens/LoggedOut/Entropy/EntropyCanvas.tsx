import React, { useState, useRef, useEffect } from 'react'
import { PanResponder, GestureResponderEvent } from 'react-native'
import { Svg, Path, Rect, Circle } from 'react-native-svg'

import { useForceUpdate } from '~/hooks/generic'
import {
  findIntersections,
  Coordinates,
  extractCoords,
  shouldComputeLine,
} from './utils'
import { Colors } from '~/utils/colors'

interface Props {
  disabled: boolean
  addPoint: (x: number, y: number) => void
}

export const MIN_DISTANCE_SQ = 30
export const MAX_LINE_PTS = 100

export const EntropyCanvas: React.FC<Props> = React.memo(
  ({ disabled, addPoint }) => {
    const {
      handleDraw,
      handleDrawStart,
      pathDs,
      pathEls,
      circles,
    } = useCanvasGestures(addPoint)

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: handleDrawStart,
      onPanResponderMove: handleDraw,
    })

    return (
      <>
        <Svg
          width="100%"
          height="100%"
          {...(!disabled && panResponder.panHandlers)}
        >
          <Rect width="100%" height="100%" opacity="0.1"></Rect>
          {pathDs.current.map((d, idx) => {
            if (!d) return null
            return (
              <Path
                key={idx}
                ref={(el) => (pathEls[idx] = el)}
                d={d}
                fill="none"
                stroke={Colors.white}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1,10"
                strokeWidth="2"
              />
            )
          })}
          {circles.map(([x, y], i) => (
            <Circle cx={x} cy={y} key={i} r={4} fill={Colors.white} />
          ))}
        </Svg>
      </>
    )
  },
)

export const useCanvasGestures = (action: (x: number, y: number) => void) => {
  const forceUpdate = useForceUpdate()

  const [circles, setCircles] = useState<number[][]>([])
  const [, setCirclesN] = useState<number>(0)

  const pathEls = useRef<any[]>(new Array(10)).current
  const pathDs = useRef<string[]>([])
  const pathIdx = useRef<number>(0)
  const linesPts = useRef<number[]>([])
  const linesPtsIdx = useRef<number>(0)
  const coords = useRef<Coordinates>({
    prevX: 0,
    prevY: 0,
    curX: 0,
    curY: 0,
  })

  useEffect(() => {
    for (let i = 0; i < pathEls.length; i++) {
      pathDs.current = [...pathDs.current, '']
    }
  }, [])

  const modifyPath = (newPath: string) =>
    (pathDs.current[pathIdx.current] += newPath)

  // NOTE: We're dynamically assigning the path prop to avoid rerendering
  // on every gesture / drawing of the line
  const setPathProps = (path: string) => {
    if (pathEls[pathIdx.current]) {
      pathEls[pathIdx.current].setNativeProps({
        d: path,
      })
    }
  }

  const handleDrawStart = (e: GestureResponderEvent): void => {
    const { curX, curY } = extractCoords(e)
    action(curX, curY)
    modifyPath(`M${curX},${curY}`)

    coords.current = {
      curX,
      curY,
      prevX: curX,
      prevY: curY,
    }
    forceUpdate()
  }

  const handleDraw = (e: GestureResponderEvent): void => {
    const { prevX, prevY } = coords.current
    const { curX, curY } = extractCoords(e)
    const newCoords = { curX, curY, prevX, prevY }
    action(curX, curY)

    if (shouldComputeLine(newCoords, MIN_DISTANCE_SQ)) {
      // NOTE(@clauxx): take each line in the path and compare
      // it to the last one
      findIntersections(linesPts.current, newCoords).map((intersection) => {
        setCircles([...circles, [intersection.x, intersection.y]])
        setCirclesN(circles.length)
      })

      // NOTE: then add the new line and maintain the line list
      if (linesPts.current.length >= MAX_LINE_PTS) {
        const isMaxPath =
          pathIdx.current < pathDs.current.length - 1 &&
          (pathIdx.current == 0 ||
            linesPtsIdx.current >= linesPts.current.length)
        if (isMaxPath) {
          pathIdx.current++
          modifyPath(`M${prevX},${prevY}L${curX},${curY}`)
          forceUpdate()
        }

        if (linesPtsIdx.current >= linesPts.current.length)
          linesPtsIdx.current = 0

        linesPts.current.splice(
          linesPtsIdx.current,
          4,
          prevX,
          prevY,
          curX,
          curY,
        )
        linesPtsIdx.current += 4
      } else {
        linesPts.current = [...linesPts.current, prevX, prevY, curX, curY]
      }

      coords.current = {
        curX,
        curY,
        prevX: curX,
        prevY: curY,
      }

      modifyPath(`L${curX},${curY}`)
      setPathProps(pathDs.current[pathIdx.current])
    } else {
      // if the line segment was too short, we don't commit it to state but we
      // draw it anyway
      coords.current = {
        ...coords.current,
        curX,
        curY,
      }

      setPathProps(pathDs.current[pathIdx.current] + `L${curX},${curY}`)
    }
  }

  return { handleDrawStart, handleDraw, pathDs, pathEls, circles }
}
