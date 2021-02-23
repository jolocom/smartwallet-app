import React from 'react';
import { useSelector } from 'react-redux';
import JoloText, { JoloTextKind } from '~/components/JoloText';
import { getInteractionDescription } from '~/modules/interaction/selectors';
import { strings } from '~/translations';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';
import { IInteractionText } from './InteractionTitle';

const InteractionDescription: React.FC<IInteractionText> = ({ label }) => {
  const { description, isAnonymous } = useSelector(getInteractionDescription);
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.mini}
      color={isAnonymous ? Colors.error : Colors.white70}
      customStyles={{ paddingHorizontal: 10 }}
    >
      {description ?? label ?? strings.UNKNOWN_DESCRIPTION}
    </JoloText>

  )
}

export default InteractionDescription;