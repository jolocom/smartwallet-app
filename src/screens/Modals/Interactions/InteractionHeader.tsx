import React from 'react'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import {
  InteractionSummary,
  FlowType,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import {
  getInteractionSummary,
  getInteractionType,
} from '~/modules/interaction/selectors'
import { useSelector } from 'react-redux'
import truncateDid from '~/utils/truncateDid'
import { Colors } from '~/utils/colors'
import getTitleText from './utils/getTitleText'
import getDescriptionText from './utils/getDescriptionText'

interface PropsI {
  title?: string
  description?: string
}

const InteractionHeader: React.FC<PropsI> = ({ title, description }) => {
  const { initiator }: InteractionSummary = useSelector(getInteractionSummary)
  const interactionType: FlowType | null = useSelector(getInteractionType)
  const isAnonymous = !initiator.publicProfile

  //TODO: @clauxx add strings
  return (
    <>
      <Header size={HeaderSizes.medium} color={Colors.white90}>
        {title || getTitleText(interactionType)}
      </Header>
      <Paragraph
        size={ParagraphSizes.small}
        color={isAnonymous ? Colors.error : Colors.white90}
        customStyles={{ paddingHorizontal: 25, marginTop: 8, marginBottom: 36 }}
      >
        {description || getDescriptionText(interactionType)}
      </Paragraph>
    </>
  )
}

export default InteractionHeader
