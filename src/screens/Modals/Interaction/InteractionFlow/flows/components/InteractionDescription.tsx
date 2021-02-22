import React from 'react';
import { useSelector } from 'react-redux';
import JoloText, { JoloTextKind } from '~/components/JoloText';
import { getInteractionDescription } from '~/modules/interaction/selectors';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';

const InteractionDescription: React.FC = () => {
  const { description, isAnonymous } = useSelector(getInteractionDescription);
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.mini}
      color={isAnonymous ? Colors.error : Colors.white70}
      customStyles={{ paddingHorizontal: 10 }}
    >
      {description}
    </JoloText>

  )
}

export default InteractionDescription;