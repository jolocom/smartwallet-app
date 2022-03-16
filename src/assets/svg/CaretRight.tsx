import * as React from 'react'
import Svg, { G, Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

function CaretRight({ fillColor = '#B2B2B2' }) {
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <G fill="none" fillRule="evenodd">
        <Path d="M0 0h30v30H0z" />
        <Path
          d="M12.793 9.174a.439.439 0 00-.31-.123.439.439 0 00-.312.123.408.408 0 000 .595L17.636 15l-5.465 5.23a.408.408 0 000 .596c.172.164.45.164.622 0l5.786-5.529a.408.408 0 000-.594l-5.786-5.529z"
          fill={fillColor}
          fillRule="nonzero"
        />
      </G>
    </Svg>
  )
}

export default CaretRight
