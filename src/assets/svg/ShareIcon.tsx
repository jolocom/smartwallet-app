import * as React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'

const ShareIcon: React.FC = () => (
  <Svg
    width="29"
    height="29"
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Rect width="29" height="29" fill="#201A21" />
    <Path
      d="M4.83337 14.5001V24.1668C4.83337 24.8077 5.08799 25.4224 5.5412 25.8756C5.99441 26.3288 6.6091 26.5835 7.25004 26.5835H21.75C22.391 26.5835 23.0057 26.3288 23.4589 25.8756C23.9121 25.4224 24.1667 24.8077 24.1667 24.1668V14.5001"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M19.3333 7.25008L14.5 2.41675L9.66663 7.25008"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M14.5001 2.41675V18.1251"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
)

export default ShareIcon
