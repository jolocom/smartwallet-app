import React from 'react'
import Svg, { Circle } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const CircleIcon = ({ stroke }) => {
  return (
    <Svg width={19} height={19} viewBox="0 0 19 19">
      <Circle
        cx={33.5}
        cy={33.5}
        r={8.5}
        transform="translate(-24 -24)"
        stroke={stroke}
        fill="none"
        fillRule="evenodd"
      />
    </Svg>
  )
}

// stroke="#FFEFDF"

export default CircleIcon
