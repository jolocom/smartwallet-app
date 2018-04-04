import * as React from 'react'
import { PanResponder, PanResponderCallbacks, PanResponderInstance } from 'react-native'
import { Svg, Path, G } from 'react-native-svg'

interface Props {
  addPoint: (x: number, y: number) => void
  drawUpon: () => void
}

interface State { 
}

export class MaskedImageComponent extends React.Component<Props, State> {
  private panResponder!: PanResponderInstance
  private paths = [[]]

  componentWillMount() {
    const config : PanResponderCallbacks = {}
    this.configureResponder(config) 
    this.registerResponderCallbacks(config)
    this.panResponder = PanResponder.create(config)
  }

  private configureResponder(config: PanResponderCallbacks) {
    config.onStartShouldSetPanResponder = () => true
    config.onStartShouldSetPanResponderCapture = () => true
    config.onMoveShouldSetPanResponder = () => true
    config.onMoveShouldSetPanResponderCapture = () => true
    config.onPanResponderRelease = () => { }
    config.onPanResponderTerminate = () => { }
    config.onShouldBlockNativeResponder = () => true
  }

  private registerResponderCallbacks(config: PanResponderCallbacks) {
    config.onPanResponderGrant = evt => {
      if (!this.paths.length) {
        this.props.drawUpon()
      }

      const { locationX, locationY } = evt.nativeEvent
      const point = { type:'M', x: locationX, y: locationY }
      this.handleNewPoint(point)
      this.props.addPoint(point.x, point.y)
    }

  config.onPanResponderMove = evt => {
    const { locationX, locationY } = evt.nativeEvent
    const point = { type: 'L', x: locationX, y: locationY }
    this.handleNewPoint(point)
    this.props.addPoint(point.x, point.y)
  }
}

  private handleNewPoint = (point: any) => {
    let { type, x, y } = point
    let current: string[]

    if (this.paths[this.paths.length - 1].length < 20) {
      current = this.paths[this.paths.length - 1]
    } else {
      current = []
      type = 'M'
      this.paths.push(current)
      this.forceUpdate()
    }

    const svgPath = `${type}${x} ${y}`
    current.push(svgPath)
    try {
      this.refs[`line${this.paths.length - 1}`].setNativeProps({d: current.join(' ')})
    } catch(err) {

    }
    // this.pathD.setNativeProps({d: this.uncoveredPath})
    // this.pathD.setNativeProps({d: this.points2.join(" ")})
  }

  private renderPaths() {
    return this.paths.map((p, i) => {
      return <Path
        d=''
        ref={`line${i}`}
        fill='none'
        stroke='black'
        strokeLinecap='square'
        strokeLinejoin= 'round'
        strokeWidth='20'
      />
    })
  }

  render() {
    return (
      <Svg
        width='100%'
        height='100%'
        { ...this.panResponder.panHandlers }
      >
      <G>
        {this.renderPaths()}
      </G>
      </Svg>
    )
  }
}