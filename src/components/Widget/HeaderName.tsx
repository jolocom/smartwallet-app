import React, { useEffect, useState } from 'react'

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
  const [displayedName, setDisplayedName] = useState<string>(indexedValue)

  useEffect(() => {
    if (indexedValue in strings === false) {
      console.warn(`No translation found for ${value}`)
    } else {
      const val = strings[indexedValue]
      setDisplayedName(val)
    }
  }, [])
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.middle}
      color={Colors.white70}
      customStyles={{ opacity: 0.6, alignSelf: 'flex-start' }}
    >
      {displayedName}
    </JoloText>
  )
}

export default HeaderName
