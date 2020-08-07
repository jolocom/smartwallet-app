import React from 'react'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { InteractionSummary } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import {
  getInteractionSummary,
  getIntermediaryState,
} from '~/modules/interaction/selectors'
import { useSelector } from 'react-redux'
import { Colors } from '~/utils/colors'
import { IntermediaryState } from '~/modules/interaction/types'
import useInteractionTitle from './hooks/useInteractionTitle'
import useInteractionDescription from './hooks/useInteractionDescription'

interface PropsI {
  title?: string
  description?: string
}

const InteractionHeader: React.FC<PropsI> = ({ title, description }) => {
  const summary: InteractionSummary = useSelector(getInteractionSummary)
  const intermediaryState = useSelector(getIntermediaryState)
  const interactionTitle = useInteractionTitle()
  const interactionDescription = useInteractionDescription()
  //NOTE: this is getting ugly b/c of the intermediary screen
  const isAnonymous =
    intermediaryState === IntermediaryState.showing
      ? false
      : !summary.initiator?.publicProfile

  //TODO: @clauxx add strings
  return (
    <>
      <Header size={HeaderSizes.medium} color={Colors.white90}>
        {title || interactionTitle}
      </Header>
      <Paragraph
        size={ParagraphSizes.small}
        color={isAnonymous ? Colors.error : Colors.white90}
        customStyles={{
          paddingHorizontal: 16,
          marginTop: 8,
          marginBottom: 36,
        }}
      >
        {description || interactionDescription}
      </Paragraph>
    </>
  )
}

export default InteractionHeader
