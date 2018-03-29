import * as React from 'react'
import { Animated, Dimensions, PanResponder, StyleSheet, View } from 'react-native'

const { Svg, Defs, G, Image, Path } = require('react-native-svg')
// import { setPath } from 'src/lib/stateChanges'
const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  img: {
    flex: 1
  }
})

export interface MaskedImageProps {
  drawUpon: any
}

export interface MaskedImageState {
  uncoveredPath: any
}

export class MaskedImageComponent extends React.Component<MaskedImageProps,MaskedImageState> {

  public _panResponder: any

  state: MaskedImageState = {
    uncoveredPath: ''
  }

  handleNewPoint = (point: any) => {
    let d = this.state.uncoveredPath + point.type + point.x + ' ' + point.y + ' '
    this.setState({uncoveredPath: d})
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
  
      onPanResponderGrant: (evt, gestureState) => {
        if (this.state.uncoveredPath === '') {
          this.props.drawUpon()
        }
        const point = {type:'M', x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY}
        this.handleNewPoint(point)
      },
      onPanResponderMove: (evt, gestureState) => {
        const point = {type: 'L', x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY}
        this.handleNewPoint(point)
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

    const { uncoveredPath } = this.state
    const { width, height } = Dimensions.get('window')

    return (
      <Svg style={styles.container} width={width} height={height}{...this._panResponder.panHandlers}>
        <G>
          {/* <Image
            href={require('src/img/entropy.jpg')}
            clipPath='url(#clip)'
          />  */}
          <Path 
            d={uncoveredPath}
            fill='none'
            stroke='black'
            strokeLinecap='round'
            strokeLinejoin= 'round'
            strokeWidth='20'
          />
          <Image style={styles.img}
            href={require('src/img/entropy.jpg')}
          />
          </G>
      </Svg>
    )
  }
}