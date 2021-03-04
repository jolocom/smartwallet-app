import React from 'react'

import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind } from '../JoloText'
import { IHeaderNameProps } from './types'

const HeaderName: React.FC<IHeaderNameProps> = ({ value }) => {
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.middle}
      color={Colors.white70}
      customStyles={{ opacity: 0.6, alignSelf: 'center', textAlign: 'left' }}
    >
      {value}
    </JoloText>
  )
}

export default HeaderName
