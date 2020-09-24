import React from 'react'
import { View } from 'react-native'

import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

interface Props {
  title: string
  visible: boolean
}

const InteractionSection: React.FC<Props> = ({ title, visible, children }) => {
  return visible ? (
    <View
      style={{ borderWidth: 2, borderColor: 'yellow', paddingHorizontal: 20 }}
    >
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        color={Colors.white35}
        customStyles={{ textAlign: 'left' }}
      >
        {title}
      </JoloText>
      {children}
    </View>
  ) : null
}

export default InteractionSection
