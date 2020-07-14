import * as React from 'react'
import Svg, { Defs, RadialGradient, Stop, G, Circle } from 'react-native-svg'

const EntropyCircle = () => {
  return (
    <Svg width="24px" height="24px" viewBox="0 0 20 20">
      <Defs>
        <RadialGradient
          cx="50.0000175%"
          cy="55.4914015%"
          fx="50.0000175%"
          fy="55.4914015%"
          r="46.0802297%"
          id="radialGradient-1"
        >
          <Stop stopColor="#FFFFFF" stopOpacity={0.46722028} offset="0%" />
          <Stop
            stopColor="#FFC8A4"
            stopOpacity={0.0309326665}
            offset="89.7316447%"
          />
          <Stop stopColor="#FFC49E" stopOpacity={0} offset="100%" />
        </RadialGradient>
      </Defs>
      <G
        id="Entropy"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <G
          id="Randomness/1/xsmax-Copy"
          transform="translate(-246.000000, -697.000000)"
        >
          <G id="Group" transform="translate(246.000000, 697.000000)">
            <G
              id="ggg"
              fill="url(#radialGradient-1)"
              fillRule="nonzero"
              opacity={0.783523787}
            >
              <G id="Randomness/1/xsmax-Copy">
                <Circle id="Oval-Copy-15" cx={10} cy={10} r={10} />
              </G>
            </G>
            <Circle id="Oval-Copy-4" fill="#FFFEFC" cx={10} cy={11} r={3} />
          </G>
        </G>
      </G>
    </Svg>
  )
}

export default EntropyCircle
