import * as React from 'react'
import { Animated, Dimensions, PanResponder, StyleSheet, View } from 'react-native'
import { Svg, Defs, G, Image, Path } from 'react-native-svg'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  img: {
    flex: 1
  }
})

export interface MaskedImageProps {
  addPoint: (x: number, y: number) => void
  drawUpon: () => void
}

export interface MaskedImageState {
}

export class MaskedImageComponent extends React.Component<MaskedImageProps,MaskedImageState> {

  private _panResponder: any
  private _pathD: any
  private _uncoveredPath: any

  private handleNewPoint = (point: any) => {
    this._uncoveredPath = this._uncoveredPath + point.type + point.x + ' ' + point.y + ' '
    this._pathD.setNativeProps({d: this._uncoveredPath})
  }

  public componentWillMount() {

    this._uncoveredPath = ''

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
  
      onPanResponderGrant: (evt, gestureState) => {
        if (this._uncoveredPath === '') {
          this.props.drawUpon()
        }
        const point = {type:'M', x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY}
        this.handleNewPoint(point)
        this.props.addPoint(point.x, point.y)
      },
      onPanResponderMove: (evt, gestureState) => {
        const point = {type: 'L', x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY}
        this.handleNewPoint(point)
        this.props.addPoint(point.x, point.y)
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      }
    })
  }

  public render() {

    const { width, height } = Dimensions.get('window')

    return (
      <Svg style={styles.container} width={width} height={height}{...this._panResponder.panHandlers}>
        <G>
          <Path
            d={this._uncoveredPath}
            ref={ref => this._pathD = ref}
            fill='none'
            stroke='black'
            strokeLinecap='round'
            strokeLinejoin= 'round'
            strokeWidth='20'
          />
          </G>
      </Svg>
    )
  }
}