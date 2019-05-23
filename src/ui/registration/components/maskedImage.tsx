import React from 'react'
import {
  PanResponder,
  PanResponderInstance,
  GestureResponderEvent,
} from 'react-native'
import { Svg, Path, Circle, CircleProps } from 'react-native-svg'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface Props {
  addPoint: (x: number, y: number) => void
}

interface State {
  linesPts: number[]
  linesPtsIdx: number
  prevX: number
  prevY: number
  curX: number
  curY: number
  pathD: string
  circles: React.ReactElement<CircleProps>[]
  circlesN: number
}

const MIN_DISTANCE_SQ = 50
const MAX_LINE_PTS = 150

export class MaskedImageComponent extends React.Component<Props, State> {
  private panResponder!: PanResponderInstance
  private _pathEl: any

  state: State = {
    linesPts: [],
    linesPtsIdx: 0,
    prevX: 0,
    prevY: 0,
    curX: 0,
    curY: 0,
    pathD: '',
    circles: [],
    circlesN: 0,
  }

  componentWillMount() {
    this.panResponder = this.getConfiguredPanResponder()
  }

  private getConfiguredPanResponder(): PanResponderInstance {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: this.handleDrawStart,
      onPanResponderMove: this.handleDraw,
    })
  }

  private handleDrawStart = (e: GestureResponderEvent): void => {
    const curX = Math.floor(e.nativeEvent.locationX), curY = Math.floor(e.nativeEvent.locationY)
    this.props.addPoint(curX, curY)

    this.setState({
      curX,
      curY,
      prevX: curX,
      prevY: curY,
      pathD: this.state.pathD + `M${curX},${curY} `,
    })
  }

  private handleDraw = (e: GestureResponderEvent): void => {
    const { prevX, prevY, linesPts, linesPtsIdx, circles, pathD } = this.state
    const curX = Math.floor(e.nativeEvent.locationX), curY = Math.floor(e.nativeEvent.locationY)

    this.props.addPoint(curX, curY)

    const dist_sq = Math.abs(curX - prevX) + Math.abs(curY - prevY)
    if (dist_sq > MIN_DISTANCE_SQ) {
      // if the new line segment is longer than the min, then
      // check if it intersects with any previous segment
      for (let i = 0; i < linesPts.length; i += 4) {
        // get intersection
        const
          a = linesPts[i], b = linesPts[i+1],
          c = linesPts[i+2], d = linesPts[i+3],
          p = prevX, q = prevY, r = curX, s = curY

        let det, gamma, lambda
        det = (c - a) * (s - q) - (r - p) * (d - b)
        if (det === 0) continue

        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
        if (0 < lambda && lambda < 1 && (0 < gamma && gamma < 1)) {
          const x = a + lambda * (c - a)
          const y = b + lambda * (d - b)

          // they intersect at (x, y)
          // so draw a circle at the intersection
          this.state.circles.push(
            <Circle
              key={circles.length}
              cx={x}
              cy={y}
              r="5"
              fill={JolocomTheme.primaryColorSand}
            />
          )
          this.setState({ circlesN: this.state.circles.length })

          // only 1 intersection per segment
          break
        }
      }

      // then add the new line and maintain the line list
      if (linesPts.length >= MAX_LINE_PTS) {
        linesPts.splice(linesPtsIdx, 4, prevX, prevY, curX, curY)
        this.state.linesPtsIdx += 4
      } else {
        linesPts.push(prevX, prevY, curX, curY)
      }


      // and finally update state
      Object.assign(this.state, {
        curX,
        curY,
        prevX: curX,
        prevY: curY,
        pathD: pathD + `L${curX},${curY} `,
        linesPts,
      })
      // update the SVG path without re-rendering
      if (this._pathEl) this._pathEl.setNativeProps({ d: this.state.pathD })
    } else {
      // if the line segment was too short, we don't commit it to state but we
      // draw it anyway
      Object.assign(this.state, {
        curX,
        curY,
      })
      // unsaved temporary line segment
      this._pathEl.setNativeProps({
        d: pathD + `L${curX},${curY} `
      })
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // optimization: rerender only if circles change
    // path is set dynamically
    return nextState.circlesN != this.state.circlesN
  }

  render() {
    return (
      <Svg width="100%" height="100%" {...this.panResponder.panHandlers}>
        <Path
          ref={el => this._pathEl = el }
          d={this.state.pathD}
          fill="none"
          stroke={JolocomTheme.primaryColorSandInactive}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1,4%"
          strokeWidth="1%"
        />
        { this.state.circles }
      </Svg>
    )
  }
}
