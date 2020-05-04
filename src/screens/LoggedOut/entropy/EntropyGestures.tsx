import React, { useState, useRef, useEffect, useCallback } from 'react'
import { PanResponder, GestureResponderEvent, View } from 'react-native'
import { Svg, Path, Circle, Rect } from 'react-native-svg'

interface Props {
  disabled: boolean
  addPoint: (x: number, y: number) => void
}

interface Coordinates {
  prevX: number
  prevY: number
  curX: number
  curY: number
}

const MIN_DISTANCE_SQ = 50
const MAX_LINE_PTS = 100

export const EntropyGestures: React.FC<Props> = React.memo(
  ({ disabled, addPoint }) => {
    const pathEls = useRef<any[]>(new Array(10)).current

    const [pathDs, setPathDs] = useState<string[]>([])
    const [pathIdx, setPathIdx] = useState<number>(0)
    const [circles, setCircles] = useState<number[][]>([])
    const [circlesN, setCirclesN] = useState<number>(0)
    const [linesPts, setLinesPts] = useState<number[]>([])
    const [linesPtsIdx, setLinesPtsIdx] = useState<number>(0)
    const [coords, setCoords] = useState<Coordinates>({
      prevX: 0,
      prevY: 0,
      curX: 0,
      curY: 0,
    })

    useEffect(() => {
      for (let i = 0; i < pathEls.length; i++) {
        setPathDs([...pathDs, ''])
      }
    }, [])

    const handleDrawStart = (e: GestureResponderEvent): void => {
      if (disabled) return

      // if the current pathD was empty and now not, we should rerender (because
      // empty pathD value would have caused the path element to not have been
      // rendered previously)
      // const shouldRerender = !pathDs[pathIdx]

      const curX = Math.floor(e.nativeEvent.locationX),
        curY = Math.floor(e.nativeEvent.locationY)
      addPoint(curX, curY)

      const newPathDs = pathDs.map((path, id) => {
        let newPath = path
        if (id === pathIdx) newPath = path + `M${curX},${curY}`
        return newPath
      })
      setPathDs(newPathDs)

      setCoords({
        curX,
        curY,
        prevX: curX,
        prevY: curY,
      })

      //TODO: see if this is still necessary
      /* if (shouldRerender) this.forceUpdate() */
    }

    const handleDraw = (e: GestureResponderEvent): void => {
      if (disabled) return

      const { prevX, prevY } = coords
      const curX = Math.floor(e.nativeEvent.locationX),
        curY = Math.floor(e.nativeEvent.locationY)

      addPoint(curX, curY)

      const dist_sq = Math.abs(curX - prevX) + Math.abs(curY - prevY)
      if (dist_sq > MIN_DISTANCE_SQ) {
        // if the new line segment is longer than the min, then
        // check if it intersects with any previous segment
        for (let i = 0; i < linesPts.length; i += 4) {
          // get intersection
          const a = linesPts[i],
            b = linesPts[i + 1],
            c = linesPts[i + 2],
            d = linesPts[i + 3],
            p = prevX,
            q = prevY,
            r = curX,
            s = curY

          let det, gamma, lambda
          det = (c - a) * (s - q) - (r - p) * (d - b)
          if (det === 0) continue

          lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
          gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
          if (0 < lambda && lambda < 1 && 0 < gamma && gamma < 1) {
            const x = a + lambda * (c - a)
            const y = b + lambda * (d - b)

            // they intersect at (x, y)
            // so draw a circle at the intersection
            setCircles([...circles, [x, y]])
            setCirclesN(circles.length)

            // only 1 intersection per segment
            break
          }
        }

        // then add the new line and maintain the line list
        if (linesPts.length >= MAX_LINE_PTS) {
          if (
            pathIdx < pathDs.length - 1 &&
            (pathIdx == 0 || linesPtsIdx >= linesPts.length)
          ) {
            setPathDs(
              pathDs.map((path, id) => {
                let newPath = path
                if (id === pathIdx)
                  newPath = `M${prevX},${prevY}L${curX},${curY}`
                return newPath
              }),
            )
            setPathIdx(pathIdx + 1)
          }

          if (linesPtsIdx >= linesPts.length) setLinesPtsIdx(0)
          setLinesPts(linesPts.splice(linesPtsIdx, 4, prevX, prevY, curX, curY))
          setLinesPtsIdx(linesPtsIdx + 4)
        } else {
          setLinesPts([...linesPts, prevX, prevY, curX, curY])
        }

        // and finally update state
        setCoords({
          curX,
          curY,
          prevX: curX,
          prevY: curY,
        })

        setPathDs(
          pathDs.map((path, id) => {
            let newPath = path
            if (id === pathIdx) newPath = path + `L${curX},${curY}`
            return newPath
          }),
        )

        // update the SVG path without re-rendering
        if (pathEls[pathIdx]) {
          pathEls[pathIdx].setNativeProps({ d: pathDs[pathIdx] })
        }
      } else {
        // if the line segment was too short, we don't commit it to state but we
        // draw it anyway
        setCoords({
          ...coords,
          curX,
          curY,
        })
        // unsaved temporary line segment
        if (pathEls[pathIdx]) {
          pathEls[pathIdx].setNativeProps({
            d: pathDs[pathIdx] + `L${curX},${curY}`,
          })
        }
      }
    }

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: handleDrawStart,
      onPanResponderMove: handleDraw,
    })

    return (
      <Svg width="100%" height="100%" {...panResponder.panHandlers}>
        <Rect width="100%" height="100%" opacity="0.1"></Rect>
        {pathDs.map((d, idx) => {
          if (!d) return null
          return (
            <Path
              key={idx}
              ref={(el) => (pathEls[idx] = el)}
              d={d}
              fill="none"
              stroke={Colors.peach}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1,10"
              strokeWidth="2"
            />
          )
        })}
        {circles.map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r="4" fill={Colors.bridal} />
        ))}
      </Svg>
    )
  },
  (prevProps, nextProps) => {
    //NOTE: re-render only if the @{disabled} prop changes
    return prevProps.disabled === nextProps.disabled
  },
)
