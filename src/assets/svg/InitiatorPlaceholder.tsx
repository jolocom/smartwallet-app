import * as React from 'react'
import Svg, { Defs, Circle, G, Mask, Use, Path } from 'react-native-svg'

function InitiatorPlaceholder() {
  return (
    <Svg width={70} height={70} viewBox="0 0 70 70">
      <Defs>
        <Circle id="prefix__a" cx={35} cy={35} r={35} />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Mask id="prefix__b" fill="#fff">
          <Use xlinkHref="#prefix__a" />
        </Mask>
        <Path
          d="M42.98 28.8c2.15 0 3.9-1.75 3.9-3.9s-1.75-3.9-3.9-3.9-3.899 1.75-3.899 3.9 1.75 3.9 3.9 3.9zm3.519 7.42a1.3 1.3 0 00-1.838 0l-4.28 4.28-9.49-11.866a1.3 1.3 0 00-1.935-.107L13 44.4v1.3c0 .728.572 1.3 1.3 1.3h41.764c.364 0 .676-.156.936-.364L46.499 36.219z"
          fill="#2B2929"
          fillRule="nonzero"
          mask="url(#prefix__b)"
        />
      </G>
    </Svg>
  )
}

export default InitiatorPlaceholder
