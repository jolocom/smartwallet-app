import * as React from 'react'
import Svg, { SvgProps, G, Path } from 'react-native-svg'

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" {...props}>
      <G fill="none" fillRule="evenodd">
        <G fillRule="nonzero">
          <G>
            <Path
              fill="#7172FE"
              d="M18.778 3.222C16.701 1.144 13.938 0 11 0 8.062 0 5.3 1.144 3.222 3.222 1.144 5.299 0 8.062 0 11c0 2.938 1.144 5.7 3.222 7.778C5.299 20.856 8.062 22 11 22c2.938 0 5.7-1.144 7.778-3.222C20.856 16.701 22 13.938 22 11c0-2.938-1.144-5.7-3.222-7.778z"
              transform="translate(-355 -193) translate(355 193)"
            />
            <Path
              fill="#FFF"
              d="M16.2 7.889c-.252-.252-.66-.252-.912 0L9.596 13.58 6.6 10.584c-.251-.251-.66-.251-.911 0-.252.252-.252.66 0 .912l3.452 3.452c.125.125.29.188.455.188.165 0 .33-.063.456-.188L16.199 8.8c.252-.251.252-.66 0-.911z"
              transform="translate(-355 -193) translate(355 193)"
            />
          </G>
        </G>
      </G>
    </Svg>
  )
}

export default SvgComponent
