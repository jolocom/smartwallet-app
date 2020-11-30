import * as React from 'react'
import { View } from 'react-native'
import Svg, { SvgProps, Defs, Rect, G, Use } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title, filter */

const DocumentCardMedium: React.FC<SvgProps> = (props) => {
  return (
    <View style={{ aspectRatio: 320 / 398 }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 320 398"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...props}
      >
        <Defs>
          <Rect id="prefix__a" x={0} y={0} width={320} height={398} rx={14.4} />
        </Defs>
        <Use fill="#FFF" xlinkHref="#prefix__a" fillRule="evenodd" />
        {props.children}
      </Svg>
    </View>
  )
}

export default DocumentCardMedium
