import React from 'react'
import Svg, { Path } from 'react-native-svg'

function SuccessTick(props: { color: string }) {
  return (
    <Svg width={'100%'} height={'100%'} viewBox="0 0 32 24">
      <Path
        d="M31.333.357a1.219 1.219 0 00-1.724 0L9.852 20.114 2.08 12.343a1.219 1.219 0 10-1.724 1.724L8.99 22.7a1.22 1.22 0 001.724 0L31.333 2.08a1.219 1.219 0 000-1.723z"
        fill={props.color}
        fillRule="nonzero"
      />
    </Svg>
  )
}

export default SuccessTick
