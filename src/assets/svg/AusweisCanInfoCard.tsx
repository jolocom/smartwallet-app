import * as React from 'react'
import Svg, {
  SvgProps,
  Defs,
  Rect,
  G,
  Mask,
  Use,
  Text,
  TSpan,
  Path,
} from 'react-native-svg'

function SvgComponent(props: SvgProps) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 358 203" {...props}>
      <Defs>
        <Rect id="prefix__a" x={0} y={0} width={358} height={203} rx={5.026} />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Mask id="prefix__b" fill="#fff">
          <Use xlinkHref="#prefix__a" />
        </Mask>
        <Rect
          stroke="#FFF"
          strokeWidth={0.5}
          x={0.25}
          y={0.25}
          width={357.5}
          height={202.5}
          rx={5.026}
        />
        <Text
          mask="url(#prefix__b)"
          fontFamily="TTCommons-Medium, TT Commons"
          fontSize={13.922}
          fontWeight={400}
          letterSpacing={0.994}
          fill="#999"
        >
          <TSpan x={15.906} y={24.931}>
            {'PERSONALAUSWEIS'}
          </TSpan>
        </Text>
        <Rect
          fill="#4E4E4E"
          mask="url(#prefix__b)"
          x={230.547}
          y={135.029}
          width={107.4}
          height={25.076}
          rx={2.387}
        />
        <Text
          mask="url(#prefix__b)"
          fontFamily="TTCommons-Regular, TT Commons"
          fontSize={20.048}
          letterSpacing={2.864}
          fill="#FFF"
        >
          <TSpan x={244.977} y={153.812}>
            {'XXXXXX'}
          </TSpan>
        </Text>
        <Path
          d="M164.317 200.705c-8.34-8.346-14.901-13.199-19.681-14.557-13.459-3.825-22.029-14.163-22.029-24.548v-7.553c13.658-13.69 22.47-37.294 22.47-58.537 0-31.157-18.064-50.04-47.142-50.04-29.077 0-46.7 18.883-46.7 50.04 0 21.243 8.811 44.847 22.469 58.537v7.553c0 10.385-8.37 19.827-22.028 24.548-4.732 1.721-11.764 6.644-21.095 14.768l133.736-.21z"
          fill="#4E4E4E"
          fillRule="nonzero"
          mask="url(#prefix__b)"
        />
      </G>
    </Svg>
  )
}

export default SvgComponent
