import React from 'react'

import { strings } from '~/translations'
import { AttrKeysUpper } from '~/types/credentials'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind } from '../JoloText'

export interface IHeaderNameProps {
  value: string
}

const HeaderName: React.FC<IHeaderNameProps> = ({ value }) => {
  const indexedValue = value.toUpperCase() as AttrKeysUpper
  if (!indexedValue) throw new Error(`No translation found for ${value}`)
  const name = strings[indexedValue]
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
