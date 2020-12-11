import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

function PlusIcon() {
  return (
    <Svg width={'100%'} height={'100%'} viewBox="0 0 40 40">
      <Path
        d="M19.117 8.513c0-.477.397-.875.883-.883a.897.897 0 01.883.883l-.007 10.605 10.614.002c.477 0 .874.397.874.874a.875.875 0 01-.883.883l-10.597-.001-.007 10.605a.875.875 0 01-.883.883.881.881 0 01-.874-.874l-.002-10.614-10.605.007A.897.897 0 017.63 20a.896.896 0 01.883-.883l10.605-.007V8.513z"
        fill="#F2F2F2"
        fillRule="nonzero"
      />
    </Svg>
  )
}

export default PlusIcon
