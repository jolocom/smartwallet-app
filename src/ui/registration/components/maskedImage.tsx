import React from 'react'
import {
  PanResponder,
  PanResponderInstance,
  GestureResponderEvent,
} from 'react-native'
import { Svg, Path, Circle } from 'react-native-svg'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface Props {
  addPoint: (x: number, y: number) => void
}

interface State {
  linesPts: number[]
  prevX: number
  prevY: number
  curX: number
  curY: number
  pathD: string
  circles: number[][]
}

const MIN_DISTANCE_SQ = 50
const MAX_LINE_PTS = 150

export class MaskedImageComponent extends React.Component<Props, State> {
  private panResponder!: PanResponderInstance

  state: State = {
    linesPts: [],
    prevX: 0,
    prevY: 0,
    curX: 0,
    curY: 0,
    pathD: '',
    circles: [],
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
    const { locationX: x, locationY: y } = e.nativeEvent
    this.props.addPoint(x, y)

    this.setState({
      curX: x,
      curY: y,
      prevX: x,
      prevY: y,
      pathD: this.state.pathD + `M${x},${y} `,
    })
  }

  private handleDraw = (e: GestureResponderEvent): void => {
    const { locationX: curX, locationY: curY } = e.nativeEvent
    const { prevX, prevY, linesPts, circles, pathD } = this.state

    this.props.addPoint(curX, curY)
    const dist_sq = Math.abs(curX - prevX) + Math.abs(curY - prevY)

    if (dist_sq > MIN_DISTANCE_SQ) {
      for (let i = 0; i < linesPts.length; i += 4) {
        const intsct = this.getIntersection(
          linesPts[i],
          linesPts[i + 1],
          linesPts[i + 2],
          linesPts[i + 3],
          prevX,
          prevY,
          curX,
          curY,
        )
        if (intsct) circles.push(intsct)
      }
      linesPts.push(prevX, prevY, curX, curY)
      if (linesPts.length > MAX_LINE_PTS) linesPts.splice(0, 4)
      this.setState({
        curX,
        curY,
        prevX: curX,
        prevY: curY,
        pathD: pathD + `L${curX},${curY} `,
        linesPts,
        circles,
      })
    } else {
      this.setState({
        curX,
        curY,
      })
    }
  }

  // returns [x, y] for the intersection of (a,b)->(c,d) with (p,q)->(r,s),
  // or undefined if they don't intersect
  private getIntersection(
    a: number,
    b: number,
    c: number,
    d: number,
    p: number,
    q: number,
    r: number,
    s: number,
  ): number[] | undefined {
    let det, gamma, lambda
    det = (c - a) * (s - q) - (r - p) * (d - b)
    if (det === 0) return

    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
    if (0 < lambda && lambda < 1 && (0 < gamma && gamma < 1)) {
      const x = a + lambda * (c - a)
      const y = b + lambda * (d - b)
      return [x, y]
    }
    return
  }

  render() {
    return (
      <Svg width="100%" height="100%" {...this.panResponder.panHandlers}>
        <Path
          d={this.state.pathD + `L${this.state.curX},${this.state.curY}`}
          fill="none"
          stroke={JolocomTheme.primaryColorSandInactive}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1,4%"
          strokeWidth="1%"
        />
        {this.state.circles.map((c, i) => (
          <Circle
            key={i}
            cx={c[0]}
            cy={c[1]}
            r={5}
            fill={JolocomTheme.primaryColorSand}
          />
        ))}
      </Svg>
    )
  }
}
