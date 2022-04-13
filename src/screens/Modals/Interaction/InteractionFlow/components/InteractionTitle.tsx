import React from 'react'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { JoloTextSizes } from '~/utils/fonts'

export interface IInteractionText {
  label: string
}

const InteractionTitle: React.FC<IInteractionText> = ({ label }) => {
  return (
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.middle}
      weight={JoloTextWeight.regular}
      color={Colors.white90}
      testID="interaction-title"
      customStyles={{
        lineHeight: BP({ xsmall: 24, default: 28 }),
        marginTop: BP({ default: 10, medium: 14, large: 14 }),
        marginBottom: BP({ default: 4, medium: 8, large: 8 }),
        marginHorizontal: BP({ default: 10, xsmall: 5 }),
      }}
    >
      {label}
    </JoloText>
  )
}

export default InteractionTitle
