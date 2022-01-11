import * as React from 'react'
import Svg, { SvgProps, G, Path } from 'react-native-svg'

const ExpandArrow: React.FC<SvgProps> = (props) => (
  <Svg width={22} height={22} {...props}>
    <G fill="none" fillRule="evenodd">
      <Path d="M0 0h22v22H0z" />
      <Path
        d="M14 12.977a.701.701 0 0 1-.217.51l-4.498 4.302a.777.777 0 0 1-1.065 0 .698.698 0 0 1 0-1.018l3.973-3.794-3.965-3.793a.695.695 0 0 1 .04-.974.775.775 0 0 1 1.017-.038l4.498 4.303a.702.702 0 0 1 .217.502z"
        fill="#6261E6"
        fillRule="nonzero"
      />
    </G>
  </Svg>
)

export default ExpandArrow
