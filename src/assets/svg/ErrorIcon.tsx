import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Props {
  color: string
  w?: number | string
  h?: number | string
}

function ErrorIcon<Props>({ color, w = '100%', h = '100%' }) {
  return (
    <Svg width={w} height={h} viewBox="0 0 24 24">
      <Path
        d="M10.852 12.004L.23 22.7a.764.764 0 000 1.076.75.75 0 001.068 0L12 13l10.703 10.778a.75.75 0 001.069 0 .764.764 0 000-1.076L13.148 12.004l10.63-10.706a.764.764 0 000-1.075.752.752 0 00-1.067 0L12 11.008 1.289.223a.752.752 0 00-1.068 0 .764.764 0 000 1.076l10.631 10.705z"
        fill={color as string}
        fillRule="nonzero"
      />
    </Svg>
  )
}

export default ErrorIcon
