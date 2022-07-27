import React from 'react'
import { TouchableOpacity } from 'react-native'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

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
        customStyles={{ textAlign: 'left', opacity: 0.7 }}
      >
        {text}
      </JoloText>
    </TouchableOpacity>
  )
}
