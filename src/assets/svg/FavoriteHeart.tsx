import * as React from 'react'
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from 'react-native-svg'

const SvgComponent = (props: SvgProps) => (
  <Svg width={20} height={18} viewBox="0 0 20 18" fill="none" {...props}>
    <Path
      d="M11.7133 17.1714C10.9895 17.8285 9.87522 17.8285 9.15141 17.1618L9.04665 17.0666C4.04665 12.5428 0.779982 9.58088 0.903792 5.88564C0.960934 4.26659 1.78951 2.71421 3.13236 1.79993C5.64665 0.0856398 8.75141 0.88564 10.4276 2.84754C12.1038 0.88564 15.2086 0.076116 17.7228 1.79993C19.0657 2.71421 19.8943 4.26659 19.9514 5.88564C20.0847 9.58088 16.8086 12.5428 11.8086 17.0856L11.7133 17.1714Z"
      fill="url(#paint0_linear_2779_36030)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_2779_36030"
        x1={7.31706}
        y1={4.09538}
        x2={11.0975}
        y2={14.5193}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#D22D69" />
        <Stop offset={1} stopColor="#911942" />
      </LinearGradient>
    </Defs>
  </Svg>
)

export default SvgComponent
