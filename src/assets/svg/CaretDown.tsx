import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={13}
      height={8}
      viewBox="0 0 13 8"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M12.158 1.367a.439.439 0 00.123-.311.439.439 0 00-.123-.31.408.408 0 00-.595 0l-5.23 5.463L1.1.745a.408.408 0 00-.594 0 .454.454 0 000 .622l5.528 5.785c.164.172.43.172.595 0l5.528-5.785z"
        fill="#FFF"
        fillRule="nonzero"
      />
    </Svg>
  )
}

export default SvgComponent
