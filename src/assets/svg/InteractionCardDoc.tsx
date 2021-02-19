import * as React from "react"
import { View } from "react-native"
import Svg, { SvgProps, Defs, Rect, Use } from "react-native-svg"

const InteractionCardDoc: React.FC<SvgProps> = (props) => {
  return (
    <View style={{ aspectRatio: 368 / 232 }}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="100%"
        height="100%"
        viewBox="0 0 368 232"
        {...props}
        >
        <Defs>
          <Rect id="prefix__a" width={368} height={232} x={0} y={0} rx={13.616} />
        </Defs>
        <Use fill="#FFF" xlinkHref="#prefix__a" fillRule="evenodd" />
        <View style={{ width: '100%', height: '100%'}}>
          {props.children}
        </View>
      </Svg>
    </View>
  )
}

export default InteractionCardDoc
