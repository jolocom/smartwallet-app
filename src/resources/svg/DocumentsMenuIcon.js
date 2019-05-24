import React from 'react'
import Svg, { G, Rect } from 'react-native-svg'
import { Platform } from 'react-native'

const fillColor = Platform.OS === 'android' ? '#f5f5f5' : 'black'

const SvgDocumentsMenuIcon = props => (
  <Svg width={28} height={28}>
    <G
      transform="translate(0 -2)"
      stroke={props.tintColor}
      strokeWidth={1.6}
      fill={fillColor}
      fillRule="evenodd"
    >
      <Rect
        opacity={0.798}
        x={7.8}
        y={3.133}
        width={19.4}
        height={15.9}
        rx={2}
      />
      <Rect x={0.8} y={10.133} width={19.4} height={14.733} rx={2} />
    </G>
  </Svg>
)

export default SvgDocumentsMenuIcon
