import React from 'react'
import useTranslation from '~/hooks/useTranslation'
import { useSelector } from 'react-redux'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { getServiceDescription } from '~/modules/interaction/selectors'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import truncateDid from '~/utils/truncateDid'

interface IInteractionDescriptionProps {
  label: string
}

const InteractionDescription: React.FC<IInteractionDescriptionProps> = ({
  label,
}) => {
  const { isAnonymous, did } = useSelector(getServiceDescription)
  const { t } = useTranslation()

  const desc = isAnonymous
    ? t('Interaction.subheaderAnonymous', { did: truncateDid(did) })
    : label

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

export default InteractionDescription
