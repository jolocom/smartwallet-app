import React from 'react';
import { useSelector } from 'react-redux';
import JoloText, { JoloTextKind } from '~/components/JoloText';
import { getServiceDescription } from '~/modules/interaction/selectors';
import { strings } from '~/translations';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';

interface IInteractionDescriptionProps {
  labelGenerator: (name: string) => string
}

const InteractionDescription: React.FC<IInteractionDescriptionProps> = ({ labelGenerator }) => {
  const { did, name, isAnonymous } = useSelector(getServiceDescription);
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.mini}
      color={isAnonymous ? Colors.error : Colors.white70}
      customStyles={{ paddingHorizontal: 10 }}
    >
      {isAnonymous
        ? strings.THIS_PUBLIC_PROFILE_CHOSE_TO_REMAIN_ANONYMOUS(did)
        : labelGenerator(name ?? '')
      }
    </JoloText>

  )
}

export default InteractionDescription;