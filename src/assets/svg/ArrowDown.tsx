import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={10}
    height={157}
    viewBox="0 0 10 157"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="m8.343 147.927-2.562 3.826L6 .5H3.996l-.22 150.797-2.038-3.604L0 148.707 4.692 157 10 149.072z"
      fill="#FFF1E3"
      fillRule="nonzero"
    />
  </Svg>
)

export default SvgComponent
