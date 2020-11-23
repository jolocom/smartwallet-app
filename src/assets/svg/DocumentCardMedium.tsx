import * as React from 'react'
import Svg, { SvgProps, Defs, Rect, G, Use } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title, filter */

function DocumentCardMedium(props: SvgProps) {
  return (
    <Svg
      width={348}
      height={426}
      viewBox="0 0 348 426"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <Defs>
        <Rect id="prefix__a" x={0} y={0} width={320} height={398} rx={14.4} />
      </Defs>
      <G transform="translate(14 10)" fill="none" fillRule="evenodd">
        <Use fill="#000" filter="url(#prefix__b)" xlinkHref="#prefix__a" />
        <Use fill="#FFF" xlinkHref="#prefix__a" />
      </G>
    </Svg>
  )
}

export default DocumentCardMedium
