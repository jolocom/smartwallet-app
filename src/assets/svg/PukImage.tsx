import * as React from 'react'
import Svg, { SvgProps, G, Circle, Path } from 'react-native-svg'

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={'100%'} height={276} viewBox="0 0 276 276" {...props}>
      <G stroke="#FFF" fill="none" fillRule="evenodd">
        <Circle strokeWidth={2} fill="#171717" cx={138} cy={138} r={137} />
        <G strokeLinecap="square" strokeWidth={1.424}>
          <Path
            d="M190.08 103.814l17.272 15.252a7.832 7.832 0 012.648 5.871v88.095c0 5.505-4.463 9.968-9.968 9.968H76.968c-5.505 0-9.968-4.463-9.968-9.968v-89.045c0-2.32 1.028-4.52 2.808-6.007l17.368-14.525h0"
            fill="#101010"
          />
          <Path
            d="M207.154 220.51c-25.375-26.092-43.635-43.051-54.78-50.878-11.147-7.828-23.716-5.1-37.707 8.183"
            fill="#101010"
          />
          <Path d="M69 220l47.1-43.5m92.477-54.9l-51.935 49.811m-88.931-50.167l52.291 51.234" />
          <Path
            d="M87.276 140.101V58.984A4.984 4.984 0 0192.26 54h92.48a4.984 4.984 0 014.984 4.984v67.241h0"
            fill="#101010"
          />
          <Path d="M106.841 78.194h22.766m-22.119 14.231h64.159m-64.159 15.655h64.159m-64.159 13.52h64.159m-24.965 14.232h22.766" />
        </G>
      </G>
    </Svg>
  )
}

export default SvgComponent
