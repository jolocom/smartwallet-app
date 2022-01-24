import * as React from 'react'
import Svg, { SvgProps, Path, Ellipse, Rect } from 'react-native-svg'

const WarningIcon = (props: SvgProps) => (
  <Svg width="100%" height="100%" viewBox="0 0 23 21" fill="none" {...props}>
    <Path
      d="M1.606 19.809a1.19 1.19 0 0 1-1.031-.593 1.184 1.184 0 0 1 0-1.187l9.511-16.43a1.19 1.19 0 0 1 2.061 0l9.512 16.43c.212.367.212.82 0 1.187a1.19 1.19 0 0 1-1.031.593H1.606Z"
      fill="#FFD21E"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.36 1.402A1.572 1.572 0 0 1 11.733.61c.568-.003 1.093.299 1.374.79l9.512 16.43c.283.49.283 1.093 0 1.582-.284.49-.808.791-1.374.791H2.222c-.567 0-1.09-.301-1.374-.79a1.578 1.578 0 0 1 0-1.583l9.512-16.43Zm2.06.395a.78.78 0 0 0-.687-.396.78.78 0 0 0-.687.396l-9.511 16.43a.79.79 0 0 0 .687 1.187h19.023a.794.794 0 0 0 .687-1.187L12.42 1.797Z"
      fill="#373737"
    />
    <Ellipse cx={11.733} cy={16.335} rx={0.793} ry={0.791} fill="#373737" />
    <Rect
      x={10.94}
      y={6.056}
      width={1.586}
      height={7.907}
      rx={0.788}
      fill="#373737"
    />
  </Svg>
)

export default WarningIcon
