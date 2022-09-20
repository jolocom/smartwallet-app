import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function SendEmailIcon() {
  return (
    <Svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M27.5 15V5.625H15H2.5V15V24.375H15"
        stroke="#FEFEFE"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M27.5 21.25H18.75"
        stroke="#FEFEFE"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M24.375 18.125L27.5 21.25L24.375 24.375"
        stroke="#FEFEFE"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M2.5 5.625L15 15L27.5 5.625"
        stroke="#FEFEFE"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  )
}

export default SendEmailIcon
