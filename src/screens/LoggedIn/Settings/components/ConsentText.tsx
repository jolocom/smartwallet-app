import React from 'react'
import { TouchableOpacity } from 'react-native'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

interface Props {
  text: string
  onPress: () => void
}

export const ConsentText: React.FC<Props> = ({ onPress, text }) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <JoloText
        color={Colors.purple}
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        customStyles={{ textAlign: 'left' }}
      >
        {text}
      </JoloText>
    </TouchableOpacity>
  )
}
