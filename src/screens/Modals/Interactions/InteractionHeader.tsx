import React from 'react'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { InteractionSummary } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { getInteractionSummary } from '~/modules/interaction/selectors'
import { useSelector } from 'react-redux'
import truncateDid from '~/utils/truncateDid'
import { Colors } from '~/utils/colors'

interface PropsI {
  title: string
  description: string
}

const InteractionHeader: React.FC<PropsI> = ({ title, description }) => {
  const { initiator }: InteractionSummary = useSelector(getInteractionSummary)
  const isAnonymous = !initiator.publicProfile

  //TODO: @clauxx add strings
  return (
    <>
      <Header size={HeaderSizes.medium} color={Colors.white90}>
        {title}
      </Header>
      <Paragraph
        size={ParagraphSizes.small}
        color={isAnonymous ? Colors.error : Colors.white90}
        customStyles={{ paddingHorizontal: 25, marginTop: 8, marginBottom: 36 }}
      >
        {isAnonymous
          ? `This public profile ${truncateDid(
              initiator.did,
            )} chose to remain anonymous. Pay attention before sharing data.`
          : description}
      </Paragraph>
    </>
  )
}

export default InteractionHeader
