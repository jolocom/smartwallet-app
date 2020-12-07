import React from 'react'

import { strings } from '~/translations'
import { AttrKeys } from '~/types/credentials'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind } from '../JoloText'

interface IProps {
  children: AttrKeys
}

const HeaderName: React.FC<IProps> = ({ children }) => {
  const name = strings[children.toUpperCase()]
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.middle}
      color={Colors.white70}
      customStyles={{ opacity: 0.6 }}
    >
      {name}
    </JoloText>
  )
}

export default HeaderName
