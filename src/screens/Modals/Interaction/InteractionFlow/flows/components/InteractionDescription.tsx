import React from 'react';
import JoloText, { JoloTextKind } from '~/components/JoloText';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';

// TODO: create common type for title and description
interface IInteractionTitleProps {
  label: string,
  hasWarning: boolean
}

const InteractionDescription: React.FC<IInteractionTitleProps> = ({ label, hasWarning }) => {
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.mini}
      color={hasWarning ? Colors.error : Colors.white70}
      customStyles={{ paddingHorizontal: 10 }}
    >
      {label}
    </JoloText>

  )
}

export default InteractionDescription;