import React from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText';
import BP from '~/utils/breakpoints';
import { JoloTextSizes } from '~/utils/fonts';

// TODO: create common type for title and description
interface IInteractionTitleProps {
  label: string
}

const InteractionTitle: React.FC<IInteractionTitleProps> = ({ label }) => {
  return (
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.middle}
      weight={JoloTextWeight.regular}
      color={Colors.white90}
      customStyles={{
        lineHeight: BP({ xsmall: 24, default: 28 }),
        marginBottom: BP({ default: 4, medium: 8, large: 8 }),
      }}
    >
      {label}
    </JoloText>
  )
}

export default InteractionTitle;