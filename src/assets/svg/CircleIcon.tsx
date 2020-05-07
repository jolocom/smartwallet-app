import React from 'react'
import Svg, { Circle } from 'react-native-svg'
import { Colors } from '~/utils/colors'

type CircleProps = {
  stroke: Colors
}

const CircleIcon: React.FC<CircleProps> = ({ stroke }) => {
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

export default CircleIcon
