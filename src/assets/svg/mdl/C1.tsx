import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

const C1 = () => (
  <Svg fill="none" height={20} viewBox="0 0 33 20" width={33}>
    <Path
      clipRule="evenodd"
      d="M10.482 3.494v9.93l13.277.013c-.92.752-1.495 1.788-1.487 3.148l-13.163-.01c-.149-5.274-7.633-5.256-7.796-.03-1.124-.008-1.28-.263-1.29-1.299v-3.96c-.015-1.77-.236-.601 1.074-3.957 1.348-3.577.977-3.247 2.196-3.34z"
      fill="#000"
      fillRule="evenodd"
    />
    <Path
      clipRule="evenodd"
      d="M7.368 9.349l.062-4.22-4.002.249c-.73.048-.736.053-.993.9l-1.023 2.73c-.344.836-.29 1.083.651.96z"
      fill="#fff"
      fillRule="evenodd"
    />
    <G fill="#000">
      <Path
        clipRule="evenodd"
        d="M33.316 13.444l.007 2.232-.984.914-2.27-.001c.01-1.294-.528-2.382-1.481-3.146z"
        fillRule="evenodd"
      />
      <Path d="M33.337.507H11.284v12.068h22.053zM5.61 19.58a3.08 3.08 0 100-6.16 3.08 3.08 0 000 6.16zM26.17 19.58a3.08 3.08 0 100-6.16 3.08 3.08 0 000 6.16z" />
    </G>
  </Svg>
)

export default C1
