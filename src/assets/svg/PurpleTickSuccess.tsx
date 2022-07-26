import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

function PurpleTickSuccess() {
  return (
    <Svg width={'100%'} height={'100%'} viewBox="0 0 20 20">
      <G fillRule="nonzero" fill="none">
        <Path
          d="M17.071 2.929A9.935 9.935 0 0010 0a9.935 9.935 0 00-7.071 2.929A9.935 9.935 0 000 10a9.934 9.934 0 002.929 7.071A9.935 9.935 0 0010 20a9.935 9.935 0 007.071-2.929A9.935 9.935 0 0020 10a9.935 9.935 0 00-2.929-7.071z"
          fill="#7172FE"
        />
        <Path
          d="M14.727 7.172a.586.586 0 00-.829 0l-5.174 5.174L6 9.622a.586.586 0 00-.828.829l3.138 3.138a.584.584 0 00.828 0L14.727 8a.586.586 0 000-.828z"
          fill="#FFF"
        />
      </G>
    </Svg>
  )
}

export default PurpleTickSuccess
