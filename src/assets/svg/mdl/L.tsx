import React from 'react'
import Svg, { Path, G } from 'react-native-svg'

const L = () => (
  <Svg fill="none" height={20} viewBox="0 0 24 20" width={24}>
    <Path
      clipRule="evenodd"
      d="M14.545.112c-.804.137-1.207.53-1.526.975l-.936 5.668H.975c-1.192.18-.956.721-.956 1.156l.903 5.53h.796c.628-2.087 4.881-2.011 5.543 0h4.773c-.23-3.647 5.014-8.785 10.314-3.776V6.67h.013V.112zm-.316 1.452h5.81l.016 5.125-6.834.056.84-4.891c.028-.1.043-.2.169-.29z"
      fill="#000"
      fillRule="evenodd"
    />
    <G stroke="#000" strokeLinecap="round" strokeLinejoin="round">
      <Path
        d="M21.944 13.373a4.06 4.06 0 11-8.121 0 4.06 4.06 0 018.12 0z"
        strokeWidth={3.42491}
      />
      <Path
        d="M6.896 15.569a2.403 2.403 0 11-4.807 0 2.403 2.403 0 014.807 0z"
        strokeWidth={2.02619}
      />
    </G>
  </Svg>
)

export default L
