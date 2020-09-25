import React from 'react'
import { View } from 'react-native'
import {
  getIntermediaryState,
  getInteractionCounterparty,
} from '~/modules/interaction/selectors'
import { useSelector } from 'react-redux'
import { Colors } from '~/utils/colors'
import { IntermediaryState } from '~/modules/interaction/types'
import useInteractionTitle from './hooks/useInteractionTitle'
import useInteractionDescription from './hooks/useInteractionDescription'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import BP from '~/utils/breakpoints'

interface PropsI {
  title?: string
  description?: string
}

const InteractionHeader: React.FC<PropsI> = ({ title, description }) => {
  const counterparty = useSelector(getInteractionCounterparty)
  const intermediaryState = useSelector(getIntermediaryState)
  const interactionTitle = useInteractionTitle()
  const interactionDescription = useInteractionDescription()
  const isAnonymous =
    intermediaryState === IntermediaryState.showing
      ? false
      : !counterparty?.publicProfile

  return (
    <>
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        weight={JoloTextWeight.regular}
        customStyles={{
          lineHeight: BP({ xsmall: 24, small: 28, medium: 28, large: 28 }),
        }}
      >
        {title || interactionTitle}
      </JoloText>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.mini}
        color={isAnonymous ? Colors.error : Colors.white70}
      >
        {description || interactionDescription}
      </JoloText>
    </>
  )
}

export default InteractionHeader
