import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

const PreviousIcon = props => (
  <Svg width={30} height={21} {...props}>
    <G fill="none" fillRule="evenodd">
      <Path fill="none" d="M-7-11.5h44v44H-7z" />
      <Path
        d="M25.218 12.968c1.7 1.628 2.527 3.84 2.527 6.763a.873.873 0 0 0 1.746.005c0-3.377-1.031-6.073-3.065-8.02-4.705-4.502-13.577-4.103-20.704-3.79-.995.044-1.947.092-2.837.122l6.517-6.517A.873.873 0 1 0 8.167.296L.256 8.208a.873.873 0 0 0 0 1.235l7.912 7.91a.87.87 0 0 0 1.235 0 .873.873 0 0 0 0-1.234L3.165 9.882C4 9.834 4.88 9.768 5.799 9.728c6.436-.283 15.253-.746 19.419 3.24z"
        fillRule="nonzero"
        fill="#FFEFDF"
      />
    </G>
  </Svg>
)

export default PreviousIcon
