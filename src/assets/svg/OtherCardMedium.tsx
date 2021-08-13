import * as React from 'react'
import { View } from 'react-native'
import Svg, { SvgProps, Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const SvgComponent: React.FC<SvgProps> = (props) => (
  <Svg
    width="100%"
    height="100%"
    viewBox="0 0 320 398"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M305.6 0c7.953 0 14.4 6.447 14.4 14.4v97.624c-5.606.513-10 5.297-10 11.123 0 5.827 4.394 10.61 10 11.124V381.6c0 7.953-6.447 14.4-14.4 14.4H14.4C6.449 396 0 389.553 0 381.6V134.132c5.12-.954 9-5.51 9-10.985s-3.88-10.03-9-10.985V14.4C0 6.447 6.449 0 14.4 0h291.2z"
      fill="#FFF"
      fillRule="evenodd"
    />
    {props.children}
  </Svg>
)

export default SvgComponent
