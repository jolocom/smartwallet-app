import React from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useSelector } from 'react-redux';
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText';
import { getInteractionTitle } from '~/modules/interaction/selectors';
import { strings } from '~/translations';
import BP from '~/utils/breakpoints';
import { JoloTextSizes } from '~/utils/fonts';

export interface IInteractionText {
  label?: string
}

const InteractionTitle: React.FC<IInteractionText> = ({ label }) => {
  const title = useSelector(getInteractionTitle);
  return (
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.middle}
      weight={JoloTextWeight.regular}
      color={Colors.white90}
      customStyles={{
        lineHeight: BP({ xsmall: 24, default: 28 }),
        marginTop: BP({ default: 8, medium: 12, large: 12 }),
        marginBottom: BP({ default: 4, medium: 8, large: 8 }),
      }}
    >
      {title ?? label ?? strings.UNKNOWN_TITLE} 
    </JoloText>
  )
}

export default InteractionTitle;