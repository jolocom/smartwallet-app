import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

const SvgSettingsMenuIcon = props => (
  <Svg width={28} height={28}>
    <G fill={props.tintColor} fillRule="evenodd">
      <Path d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      <Path
        d="M19 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        opacity={0.7}
      />
      <Path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        opacity={0.85}
      />
    </G>
  </Svg>
)

export default SvgSettingsMenuIcon
