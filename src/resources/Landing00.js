import React from 'react'
import {
  Svg,
  Rect
} from 'react-native-svg'

export default class Landing00 extends React.PureComponent {
  render() {
    return(
        <Svg height={this.props.height} width={this.props.width}>
          <Rect
            width="206"
            height="200"
            fill="grey"
          />
        </Svg>
    )
  }
}