import React from 'react'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind } from '../JoloText'

const HeaderName: React.FC = ({ children }) => {
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.middle}
      color={Colors.white70}
      customStyles={{ opacity: 0.6 }}
    >
      {children}
    </JoloText>
  )
}

export default HeaderName
