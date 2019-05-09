import React from 'react'
import {
  PanResponder,
  PanResponderInstance,
  GestureResponderEvent,
} from 'react-native'
import { Svg, Path } from 'react-native-svg'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface Props {
  addPoint: (x: number, y: number) => void
}

interface State {
  currentPath: string[]
  limit: number
}

interface Point {
  type: string
  x: number
  y: number
}

export class MaskedImageComponent extends React.Component<Props, State> {
  private panResponder!: PanResponderInstance

  state = {
    currentPath: [],
    limit: 15,
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
    const { locationX, locationY } = e.nativeEvent
    this.props.addPoint(locationX, locationY)

    const point = { type: 'M', x: locationX, y: locationY }
    this.handleNewPoint(point)
  }

  private handleDraw = (e: GestureResponderEvent): void => {
    const { locationX, locationY } = e.nativeEvent
    this.props.addPoint(locationX, locationY)

    const point = { type: 'L', x: locationX, y: locationY }
    this.handleNewPoint(point)
  }

  private handleNewPoint(p: Point): void {
    const svgCoordinate = `${p.type}${p.x} ${p.y}`
    const newSvgPathCoords: string[] = this.state.currentPath.concat()

    if (newSvgPathCoords.length === this.state.limit) {
      newSvgPathCoords.shift()
      newSvgPathCoords[0] = `M${newSvgPathCoords[0].substring(1)}`
    }

    newSvgPathCoords.push(svgCoordinate)
    this.setState({ currentPath: newSvgPathCoords })
  }

  render() {
    return (
      <Svg width="100%" height="100%" {...this.panResponder.panHandlers}>
        <Path
          d={this.state.currentPath.join(' ')}
          fill="none"
          stroke={JolocomTheme.primaryColorSand}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={20}
        />
      </Svg>
    )
  }
}
