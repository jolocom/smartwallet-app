import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

const SvgRecordsMenuIcon = props => (
  <Svg width={28} height={28}>
    <G fill="none" fillRule="evenodd">
      <Path
        stroke={props.tintColor}
        strokeWidth={1.5}
        d="M6.111 1.59l4.243 4.243-4.243 4.242h0M1.243 1.59l4.242 4.243-4.242 4.242h0"
      />
      <Path fill={props.tintColor} d="M12 10h12v1.5H12z" />
      <Path fill={props.tintColor} opacity={0.804} d="M8 15h12v1.5H8z" />
      <Path fill={props.tintColor} opacity={0.704} d="M4 20h12v1.5H4z" />
    </G>
  </Svg>
)

export default SvgRecordsMenuIcon
