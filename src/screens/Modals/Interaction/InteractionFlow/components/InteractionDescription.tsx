import React from 'react';
import useTranslation from '~/hooks/useTranslation'
import { useSelector } from 'react-redux';
import JoloText, { JoloTextKind } from '~/components/JoloText';
import { getServiceDescription } from '~/modules/interaction/selectors';
import { strings } from '~/translations';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';

interface IInteractionDescriptionProps {
  label: string,
  withServiceName?: boolean
}

const InteractionDescription: React.FC<IInteractionDescriptionProps> = ({ label, withServiceName = true }) => {
  const { did, name, isAnonymous } = useSelector(getServiceDescription);
  const { t } = useTranslation()

  const desc = isAnonymous
    ? t(strings.THIS_PUBLIC_PROFILE_CHOSE_TO_REMAIN_ANONYMOUS, { did })
    : t(label, { service: name })
  
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.mini}
      color={isAnonymous ? Colors.error : Colors.white70}
      customStyles={{ paddingHorizontal: 10 }}
    >
      {desc}
    </JoloText>

  )
}

export default InteractionDescription;