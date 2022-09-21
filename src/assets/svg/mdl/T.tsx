import React from 'react'
import Svg, { Path, G } from 'react-native-svg'

const T = () => (
  <Svg fill="none" height={20} viewBox="0 0 28 20" width={28}>
    <Path
      clipRule="evenodd"
      d="M17.957.552c-.815.14-1.224.537-1.548.989l-.95 5.75H.99c-1.209.182-.97.73-.97 1.172l.916 5.61h.807c.637-2.118 4.952-2.041 5.623 0h8.045c-.234-3.7 5.086-8.912 10.462-3.831V7.203h.013V.552zm-.32 1.473h5.893l.017 5.199-6.932.056.85-4.962c.03-.1.045-.203.172-.293z"
      fill="#000"
      fillRule="evenodd"
    />
    <Path
      d="M25.462 14.003a4.12 4.12 0 11-8.24 0 4.12 4.12 0 018.24 0zM6.994 15.697a2.437 2.437 0 11-4.874 0 2.437 2.437 0 014.874 0z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.09873}
    />
    <G fill="#000">
      <Path d="M11.767 4.426H9.95V9.23h1.818z" />
      <Path d="M11.124.421h-.588V5h.588z" />
    </G>
  </Svg>
)

export default T
