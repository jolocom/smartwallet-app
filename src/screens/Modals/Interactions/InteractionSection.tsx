import React from 'react'

import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

interface Props {
  title: string
  visible: boolean
}

const InteractionSection: React.FC<Props> = ({ title, visible, children }) => {
  return visible ? (
    <>
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        color={Colors.white35}
        customStyles={{ textAlign: 'left' }}
      >
        {title}
      </JoloText>
      {children}
    </>
  ) : null
}

export default InteractionSection
